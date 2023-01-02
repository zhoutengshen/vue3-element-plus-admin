import type { ThemeType } from '@/constant'
import type { RouteMeta } from 'vue-router'

export interface MenusRouteRecord {
  children?: MenusRouteRecord[]
  props?: Record<string, any> | boolean
  path?: string
  name?: string
  meta?: RouteMeta
}
export interface AppState {
  serverMenus: MenusRouteRecord[]
  clientMenus: MenusRouteRecord[]
  /** 使用的主题 */
  usingTheme: ThemeType
  /** 是否折叠 */
  collapse: boolean
}
