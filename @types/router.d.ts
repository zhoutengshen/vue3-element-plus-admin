import 'vue-router'
declare type RoleType = string | '*' | 'user' | 'admin'
declare module 'vue-router' {
  interface RouteMeta {
    /** 访问路由所需权限集合 */
    roles?: RoleType[]
    /** 浏览器tab 标题，或者侧边栏标题 */
    title?: string
    /** 当前 SideBar 解析图标都是按 RouteComponent 解析（TODO: 如果是将来需要后端配置图标怎么处理） */
    icon?: string | RouteComponent | (() => Promise<RouteComponent>)
  }
}
