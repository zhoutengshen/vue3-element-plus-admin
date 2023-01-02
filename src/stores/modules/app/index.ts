import { defineStore } from 'pinia'
import { getServerMenus } from '@/api/user'
import { getLocalStoreValue } from '@/utils'
import { ThemeType, THEME_KEY } from '@/constant'
import { MODULES_ROUTES } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'
import { isObject } from '@/utils/is'
import type { AppState, MenusRouteRecord } from './types'
import { markRaw } from 'vue'

const getLocalStoreThemeType = (): ThemeType => {
  const themeType = getLocalStoreValue<ThemeType>(THEME_KEY) || ThemeType.dark
  return Object.values(ThemeType).includes(themeType) ? themeType : ThemeType.dark
}

const routesToMenusRoutes = (routes: RouteRecordRaw[]): MenusRouteRecord[] => {
  const result = Array<MenusRouteRecord>()
  routes.forEach((item) => {
    const menuRecord: MenusRouteRecord = {
      name: String(item.name),
      path: item.path,
      props: isObject(item.props) ? { ...item.props } : item.props || {},
      meta: markRaw({ ...item.meta }),
    }
    if (item.children) {
      menuRecord.children = routesToMenusRoutes(item.children)
    }
    result.push({ ...menuRecord })
  })
  return result
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      // 服务端加载过来的侧边栏
      serverMenus: [],
      // 客户端根据权限过滤出来的侧边栏
      clientMenus: routesToMenusRoutes(MODULES_ROUTES),
      usingTheme: getLocalStoreThemeType(),
      collapse: false,
    }
  },
  actions: {
    async fetchServerMenus() {
      const resp = await getServerMenus()
      this.serverMenus = resp || []
    },
    changeTheme(theme: ThemeType) {
      this.usingTheme = theme
    },
    reset() {
      this.$reset()
    },
    toggleMenusCollapse() {
      this.collapse = !this.collapse
    },
  },
})
