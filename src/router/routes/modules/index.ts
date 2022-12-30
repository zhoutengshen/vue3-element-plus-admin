import type { RouteRecordRaw } from 'vue-router'
type ModuleRoutesRecordRaw = Record<string, { default: RouteRecordRaw | RouteRecordRaw[] }>

/**
 * 整体导出modules 里面所有的默认配置
 */
const getModulesRoutes = () => {
  const matchModulesMap: ModuleRoutesRecordRaw = import.meta.glob(['!./index.ts', './*.ts'], {
    eager: true,
  })
  return Object.values(matchModulesMap).reduce((pre, next) => {
    if (next.default) {
      const nextRoutes = Array.isArray(next.default) ? next.default : [next.default]
      pre.push(...nextRoutes)
    }
    return pre
  }, Array<RouteRecordRaw>())
}

const MODULES_ROUTES = getModulesRoutes()
export { MODULES_ROUTES }
