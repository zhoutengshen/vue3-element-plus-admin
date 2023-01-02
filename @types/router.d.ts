import 'vue-router'
declare type RoleType = string | '*' | 'user' | 'admin'
declare module 'vue-router' {
  interface RouteMeta {
    /** 访问路由所需权限集合 */
    roles?: RoleType[]
    /** 浏览器tab 标题，或者侧边栏标题 */
    title?: string
  }
}
