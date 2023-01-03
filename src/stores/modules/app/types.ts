import type { ThemeType } from '@/constant'
import type { Component, Raw } from 'vue'
import type { RouteMeta } from 'vue-router'

export interface MenusRouteRecord {
  children?: MenusRouteRecord[]
  props?: Record<string, any> | boolean
  path?: string
  fullPath?: string
  name?: string
  meta?: Raw<RouteMeta>
}

export interface OpenedPage {
  path: string
  icon?: Raw<Component>
  label?: string
}

export interface AppState {
  serverMenus: Raw<MenusRouteRecord[]>
  clientMenus: Raw<MenusRouteRecord[]>
  /** 使用的主题 */
  usingThemeType: ThemeType
  /** 是否折叠 */
  collapseSideMenus: boolean
  openedPages: OpenedPage[]
  pathOpenPageMap: Raw<Record<string, OpenedPage>>
  isShowDrawer: boolean
  isShowTabs: boolean
}
