/** RouterNavHelper 生成工具 */
import glob from 'glob'
import { join, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { parse, compileScript, SFCScriptBlock } from '@vue/compiler-sfc'
import { readFileSync, writeFileSync } from 'fs'
const progRootPath = fileURLToPath(new URL('..', import.meta.url))
const pagesPath = resolve(progRootPath, 'src/views')
const genCodeTargetFullFilePath = resolve(progRootPath, 'src/router/helper/routerNavHelper.ts')
const importPlaceholder = '/** importPlaceholder */'
const classBodyPlaceholder = '/** classBodyPlaceholder */'
const genNavFuncTemp = (funName: string, type: string, path: string, gp: String = 'any') => {
  return `
    public ${funName}(params?: ${gp}) {
      return navigatorUtil<any>({ path: '${path}', type: '${type}', params: params })
    }
`
}
// 模板
const routerNavHelperTemp = `/* eslint-disable */
// 该部分代码油node自动生成，不要动
${importPlaceholder}

class RouterNavHelper {
  ${classBodyPlaceholder}
}

export const routerNavHelper = new RouterNavHelper()
export default routerNavHelper`

type Statements = SFCScriptBlock['scriptAst']
const checkHasExportPageParams = (arr: Statements = []) => {
  return arr.some((item) => {
    // @ts-ignore
    const isScriptExport = item.type === 'ExportNamedDeclaration' && item?.declaration?.id?.name === 'PageParams'
    return isScriptExport
  })
}
const gen = (pattern: string, root: string = pagesPath) => {
  glob(
    pattern,
    {
      root: '',
      // 查找根的路径
      cwd: root,
    },
    async (err, filePaths) => {
      let index = 0
      const importCodeArr: string[] = [`import { navigatorUtil } from '@/router/helper/index'`]
      const navFuncsCodeArr: string[] = []
      filePaths.forEach((path, pathIndex) => {
        // @ts-ignore
        const file = readFileSync(join(root, path), 'utf-8')
        const parseResult = parse(file)

        if (!parseResult.descriptor.script && !parseResult.descriptor.scriptSetup) {
          return
        }
        const script = compileScript(parseResult.descriptor, { id: `test_${pathIndex}` })
        // @ts-ignore
        const funcName = path.split('/').reduce((pre, next, index) => {
          if (!next) {
            return pre
          }
          if (!next.length) {
            return pre
          }
          if (next.toUpperCase().includes('index.vue'.toUpperCase())) {
            return pre
          }
          let firstStr = next[0]
          if (typeof firstStr === 'number' && index === 0) {
            return `_${next}`
          }
          if (index) {
            firstStr = next[0].toUpperCase()
          }
          next = firstStr + next.slice(1)
          pre += next
          return pre
        }, '')
        const hasExportPageParams = checkHasExportPageParams([
          ...(script.scriptAst || []),
          ...(script.scriptSetupAst || []),
        ])

        const gpName = hasExportPageParams ? `PageParams_${index++}` : 'any'
        const routePath = path.split('/').reduce((pre, next) => {
          if (next.toUpperCase().includes('index.vue'.toUpperCase())) {
            return pre
          }
          return `${pre}/${next}`
        }, '')
        const funcPushCodeStr = genNavFuncTemp(`${funcName}Push`, 'push', routePath, gpName)
        const funcReplaceCodeStr = genNavFuncTemp(`${funcName}Replace`, 'replace', routePath, gpName)
        navFuncsCodeArr.push(funcPushCodeStr, funcReplaceCodeStr)
        if (hasExportPageParams) {
          importCodeArr.push(`import type { PageParams as ${gpName} } from '@/views/${path}'`)
        }
      })
      const codeStr = routerNavHelperTemp
        .replace(importPlaceholder, importCodeArr.join('\n'))
        .replace(classBodyPlaceholder, navFuncsCodeArr.join('\n'))
      writeFileSync(genCodeTargetFullFilePath, codeStr, { encoding: 'utf-8', mode: '0666', flag: 'w+' })
    },
  )
}
gen('**/*.vue', pagesPath)
