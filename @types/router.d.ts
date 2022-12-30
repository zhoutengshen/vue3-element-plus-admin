import 'vue-router'
declare type RoleType = string | '*' | 'user' | 'admin'
declare module 'vue-router' {
  interface RouteMeta {
    /** 访问路由所需权限集合 */
    roles: RoleType[]
  }
}
