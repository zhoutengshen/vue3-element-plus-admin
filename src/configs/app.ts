import { ThemeType } from '@/constant'

/** 应用程序配置，运行时相关的配置，例如api 基础路径，cdn 路径等 */
export const AppConfig = Object.freeze({
  API_BASE_URL: import.meta.env.VITE_BASE_URL,
  APP_ENV: import.meta.env.VITE_APP_ENV,
})

export enum LayoutType {
  DEFAULT = 'DEFAULT',
}

/** 应用程序设置，例如布局，色调,布局等，主题等 */
export const AppSettings = Object.freeze({
  /** 使用服务端的配置生成侧边栏的路由，TODO：(未实现，目前是客户端路由配置，根据用户权限生成) */
  usingServerSideMenus: false,
  /** main 区域内容是否使用tabs展示 */
  usingTabsPage: true,
  /** 布局类型 */
  layoutType: LayoutType.DEFAULT,
  /** 默认配置的主题类型 */
  defaultThemeType: ThemeType.dark,
})
