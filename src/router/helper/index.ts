import type { LocationQueryRaw, RouteParamsRaw } from 'vue-router'
import routerInstance from '../index'

export interface INavigator<T> {
  type: 'push' | 'replace' | 'back'
  params?: T
  query?: T
  path?: string
  name?: string
}
export const navigatorUtil = async <P extends LocationQueryRaw & RouteParamsRaw = any>(
  params: INavigator<P> = { type: 'push' },
) => {
  const toParams = {
    path: params.path,
    name: params.name,
    query: params.query,
    params: params.params,
  }
  if (params.type == 'push') {
    await routerInstance.push(toParams)
  } else if (params.type == 'replace') {
    await routerInstance.replace(toParams)
  } else {
    await routerInstance.back()
  }
}
