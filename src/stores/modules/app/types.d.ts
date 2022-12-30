import type { RouteRecordNormalized } from 'vue-router'
declare type MenusRouteRecord = ReadonlyFlat<
  Pick<RouteRecordNormalized, 'path' | 'children' | 'meta' | 'name' | 'props'> & {
    [P: string]: any
  }
>
export interface AppState {
  serverMenus: MenusRouteRecord[]
  clientMenus: MenusRouteRecord[]
}
