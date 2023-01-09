import { Plugin } from 'vite'
import { checkSourceFilesExist, dealWithPluginOption } from './utils'
import { RouterHelperPluginOption, Transform } from './core'

const VITE_PLUGIN_NAME = 'vite:router-helper'

export default (ops: RouterHelperPluginOption): Plugin => {
  // 根据系统切换为一致的路径
  ops = dealWithPluginOption(ops)
  if (!checkSourceFilesExist(ops.sourceFiles)) {
    return {
      name: VITE_PLUGIN_NAME,
    }
  }
  const transform = new Transform(ops)

  return {
    name: VITE_PLUGIN_NAME,
    config() {},
    configResolved() {},
    transform(code, id) {
      if (ops.sourceFiles.includes(id)) {
        transform.transform(id)
      }
    },
    watchChange() {},
    closeBundle() {
      console.log(transform.getResultList())
    },
  }
}
