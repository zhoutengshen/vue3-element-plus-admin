import { defineStore } from 'pinia'
import { getServerMenus } from '@/api/user'
import { getLocalStoreValue } from '@/utils'
import { ThemeType, THEME_KEY } from '@/constant'
import { MODULES_ROUTES } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'
import { isObject, isUndef } from '@/utils/is'
import type { AppState, MenusRouteRecord, OpenedPage } from './types'
import { markRaw, toRaw } from 'vue'
import { AppSettings } from '@/configs/app'
import { join } from 'path'

/** 获取上次切换保存的主题，如果错误或者不存在使用暗色主题 */
const getLocalStoreThemeType = (): ThemeType => {
  const themeType = getLocalStoreValue<ThemeType>(THEME_KEY) || AppSettings.defaultThemeType
  return Object.values(ThemeType).includes(themeType) ? themeType : AppSettings.defaultThemeType
}

/**
 *
 * @param routes 原始路由
 * @param fatherPath 上一级路由完整路径
 * @param visitLeaf 访问叶子节点回调函数
 * @returns
 */
const routesToMenusRoutes = (
  routes: RouteRecordRaw[],
  fatherPath = '',
  visitLeaf: (v: any) => any = () => {},
): MenusRouteRecord[] => {
  const result = Array<MenusRouteRecord>()
  routes.forEach((item) => {
    const fullPath = join(fatherPath, item.path)
    const menuRecord: MenusRouteRecord = {
      name: String(item.name),
      path: item.path,
      fullPath: fullPath,
      props: isObject(item.props) ? { ...item.props } : item.props || {},
      meta: markRaw({ ...item.meta }),
    }
    if (item.children) {
      menuRecord.children = routesToMenusRoutes(item.children, fullPath, visitLeaf)
    } else {
      // 访问叶子节点
      visitLeaf(menuRecord)
    }
    result.push({ ...menuRecord })
  })
  return result
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    const pathOpenPageMap: Record<string, OpenedPage> = {}
    const clientMenus = routesToMenusRoutes(MODULES_ROUTES, '', (v: MenusRouteRecord) => {
      if (!isUndef(v.fullPath)) {
        // 可能为 ''
        const fullPath = v.fullPath || '/dashboard'
        pathOpenPageMap[fullPath] = {
          path: v.fullPath,
          icon: v.meta?.icon,
          label: v.meta?.title,
        }
      }
    })

    const activeOpenedPath = pathOpenPageMap[location.pathname]
    return {
      /** 服务端加载过来的侧边栏 */
      serverMenus: toRaw([]),
      /** 客户端根据权限过滤出来的侧边栏 */
      clientMenus: toRaw(clientMenus),
      /** 正在使用的主题类型 */
      usingThemeType: getLocalStoreThemeType(),
      /** 是否收起侧边菜单 */
      collapseSideMenus: false,
      /** 打开过的页面 */
      openedPages: [activeOpenedPath],
      /** 路径与 打开页面的映射（作为常量） */
      pathOpenPageMap: toRaw(pathOpenPageMap),
      isShowDrawer: false,
      isShowTabs: true,
    }
  },
  actions: {
    async fetchServerMenus() {
      const resp = await getServerMenus()
      this.serverMenus = resp || []
    },
    changeTheme(theme: ThemeType) {
      this.usingThemeType = theme
    },
    reset() {
      this.$reset()
    },
    toggleMenusCollapse() {
      this.collapseSideMenus = !this.collapseSideMenus
    },
    addOpenedPage(openedPage: OpenedPage) {
      if (openedPage.path && !this.openedPages.find((item) => item.path === openedPage.path)) {
        this.openedPages.push(openedPage)
      }
    },
    removeOpenedPage(path: string): number {
      const fIndex = this.openedPages.findIndex((item) => item.path === path)
      if (fIndex === -1) {
        return -1
      }
      this.openedPages.splice(fIndex, 1)
      this.openedPages = this.openedPages.filter((item) => item.path !== path)
      return fIndex
    },
  },
})
