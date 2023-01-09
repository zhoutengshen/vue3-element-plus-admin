import { Project, ts, SourceFile } from 'ts-morph'
import { checkSourceFilesExist, convertTitleCase, isQuotesWrap, quotesWrapReg, transformWidthState } from './utils'
import { SFCScriptBlock, parse, compileScript } from '@vue/compiler-sfc'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

type SFCStatements = SFCScriptBlock['scriptAst']

interface PluginOption {
  tsConfigJsonPath: string
  sourceFiles: string[]
  baseUrl: string
}
// export [PluginOption] alias
export type RouterHelperPluginOption = PluginOption

// 遍历时的中间状态 或者结果
type TransformMidState = {
  paths: string[]
  navHandleName: string
  cpmPath?: string
}

interface Result {
  path: string
  navHandleName: string
  pageParamName?: string
}

/**
 * @description objMap for simple search
 */
type FileSourceResult = Record<string, Record<string, Result>>

const vueSFCIndex = 1
const getPageParamNameFromSFC = (filePath: string) => {
  const checkHasExportPageParams = (arr: SFCStatements = []) => {
    return arr.some((item) => {
      // @ts-ignore
      const isScriptExport = item.type === 'ExportNamedDeclaration' && item?.declaration?.id?.name === 'PageParams'
      return isScriptExport
    })
  }
  const file = readFileSync(filePath, 'utf-8')
  const parseResult = parse(file)

  if (!parseResult.descriptor.script && !parseResult.descriptor.scriptSetup) {
    return
  }
  const script = compileScript(parseResult.descriptor, { id: `test_${vueSFCIndex}` })
  const hasExportPageParams = checkHasExportPageParams([...(script.scriptAst || []), ...(script.scriptSetupAst || [])])
  return hasExportPageParams ? `PageParam_${vueSFCIndex}` : undefined
}

export class Transform {
  private
  /**
   * @example
   * ```
   * {
   *    filePath: {
   *        somRoutePath: {
   *        routePath: somRoutePath,
   *        navHandleName: someHandleName,
   *      }
   *    }
   * }
   * ```
   */
  private _resultsMap: FileSourceResult = {}
  private _project: Project
  private _cacheMethodNames: Record<string, number> = {}
  /** 当前正在做转换的文件路径 */
  private _transformingFilePath?: string

  constructor(private option: PluginOption) {
    this.init(option)
  }
  private init(ops: PluginOption) {
    this._project = new Project({
      tsConfigFilePath: ops.tsConfigJsonPath,
    })
    this._project.addSourceFilesAtPaths(ops.sourceFiles)
  }

  public transform(path: string) {
    this._transformingFilePath = path
    const sourceFile = this._project.getSourceFile(path)
    if (sourceFile) {
      const value = this.transform4One(sourceFile)
      this.dealWithResult(value)
    }
  }

  public getResultList(path?: string): Result[] {
    if (path) {
      const fileResultMap = this._resultsMap[path]
      return fileResultMap ? Object.values(fileResultMap) : []
    }
    return Object.values(this._resultsMap).reduce((preList, nextObj) => {
      preList.push(...Object.values(nextObj))
      return preList
    }, Array<Result>())
  }

  private transform4One(routeSourceFile: SourceFile): TransformMidState[] {
    const resultList: TransformMidState[] = []
    const classCtx = this
    transformWidthState<TransformMidState>(routeSourceFile, {
      init: () => ({ paths: [], navHandleName: '' }),
      visiting: {
        ObjectLiteralExpression(node, state) {
          if (!ts.isObjectLiteralExpression(node)) {
            return
          }
          // get routPath
          const pathProNode = node.properties.find((item) => item.name?.getText() === 'path')
          if (!pathProNode || !ts.isPropertyAssignment(pathProNode)) {
            return
          }
          const exprValue = pathProNode.initializer.getText()
          const result: TransformMidState = {
            paths: [...state.paths, exprValue],
            navHandleName: '',
          }
          // get routeHandleName
          const handleNameProNode = node.properties.find((item) => item.name?.getText() === 'navHandleName')
          if (!handleNameProNode) {
            result.navHandleName = classCtx.getRealMethodName(undefined, result.paths)
          }
          if (
            handleNameProNode &&
            ts.isPropertyAssignment(handleNameProNode) &&
            ts.isStringLiteral(handleNameProNode.initializer)
          ) {
            const handleName = handleNameProNode.initializer.getText()
            result.navHandleName = classCtx.getRealMethodName(handleName, result.paths)
          }
          // get route component path
          const compNode = node.properties.find((item) => item.name?.getText() === 'component')
          if (compNode) {
            const importText = compNode.getText()
            const matchImportPathReg = /import\((.+?)\)/
            const importPath = importText.match(matchImportPathReg)?.[1]
            if (importPath) {
              classCtx.getPageParamName(importPath.replace(quotesWrapReg, '$1'))
            }
          }
          resultList.push(result)
          return {
            node: node,
            state: result,
          }
        },
      },
    })
    return resultList
  }

  private dealWithResult(newList: TransformMidState[]) {
    if (!this._transformingFilePath) {
      return
    }
    const pathResultMap = newList.reduce((pre, next) => {
      const result = this.mapState2Result(next)
      pre[result.path] = result
      return pre
    }, {} as Record<string, Result>)
    this._resultsMap[this._transformingFilePath] = pathResultMap
  }

  /** TODO: need to be simple */
  private getRealMethodName(originName?: string, paths?: string[]) {
    if (!originName) {
      if (paths?.length) {
        // all is string literal
        const isAllLiteralStr = !paths.some((item) => !isQuotesWrap(item))
        if (isAllLiteralStr) {
          originName = paths
            .map((item) => convertTitleCase(item.replace('/', '').replace(quotesWrapReg, '$1')))
            .join('')
        }
      }
    }
    if (!originName) {
      originName = `handleNavToPage_${Math.abs(Math.random() * Number.MAX_SAFE_INTEGER)}`
    }
    // 除去首尾多余的双引号空白符号
    originName = originName.replace(quotesWrapReg, '$1').trim()
    const count = this._cacheMethodNames[originName]
    if (count !== undefined) {
      this._cacheMethodNames[originName] = count + 1
      return `${originName}${count + 1}`
    }
    return originName
  }

  /** mapping MidState to Result */
  private mapState2Result(state: TransformMidState): Result {
    return {
      path: this.dealWithPath(state.paths),
      navHandleName: state.navHandleName,
    }
  }

  /** convert paths array to path string */
  private dealWithPath(paths: string[]): string {
    // check all paths is literal string
    const isAllLiteralStr = !paths.some((item) => !isQuotesWrap(item))
    if (isAllLiteralStr) {
      const value = paths
        .map((item) => item.replace(quotesWrapReg, '$1').trim())
        .join('/')
        .replace(/\\+/, '\\')
      return `"${value}"`
    }
    // some case like this  ['"/string literal"','var + "string literal"','"string literal"']
    return paths.join(' + ')
  }

  private getPageParamName(filePath: string) {
    const realFilePath = join(this.option.baseUrl, filePath.replace('@', './src/'))
    console.log('>>>>>>>>>>>')

    if (!checkSourceFilesExist([realFilePath])) {
      return
    }
    // TODO:
    // const pageParamsName = getPageParamNameFromSFC(filePath)
    // console.log(pageParamsName)
  }
}
