/* eslint-disable */
// 该部分代码油node自动生成，不要动
import { navigatorUtil } from '@/router/helper/index'
import type { PageParams as PageParams_0 } from '@/views/dashboard/index.vue'
import type { PageParams as PageParams_1 } from '@/views/login/index.vue'

class RouterNavHelper {
  
    public dashboardPush(params?: PageParams_0) {
      return navigatorUtil<any>({ path: '/dashboard', type: 'push', params: params })
    }


    public dashboardReplace(params?: PageParams_0) {
      return navigatorUtil<any>({ path: '/dashboard', type: 'replace', params: params })
    }


    public exception403Push(params?: any) {
      return navigatorUtil<any>({ path: '/exception/403', type: 'push', params: params })
    }


    public exception403Replace(params?: any) {
      return navigatorUtil<any>({ path: '/exception/403', type: 'replace', params: params })
    }


    public exception404Push(params?: any) {
      return navigatorUtil<any>({ path: '/exception/404', type: 'push', params: params })
    }


    public exception404Replace(params?: any) {
      return navigatorUtil<any>({ path: '/exception/404', type: 'replace', params: params })
    }


    public exception500Push(params?: any) {
      return navigatorUtil<any>({ path: '/exception/500', type: 'push', params: params })
    }


    public exception500Replace(params?: any) {
      return navigatorUtil<any>({ path: '/exception/500', type: 'replace', params: params })
    }


    public loginPush(params?: PageParams_1) {
      return navigatorUtil<any>({ path: '/login', type: 'push', params: params })
    }


    public loginReplace(params?: PageParams_1) {
      return navigatorUtil<any>({ path: '/login', type: 'replace', params: params })
    }


    public redirectPush(params?: any) {
      return navigatorUtil<any>({ path: '/redirect', type: 'push', params: params })
    }


    public redirectReplace(params?: any) {
      return navigatorUtil<any>({ path: '/redirect', type: 'replace', params: params })
    }

}

export const routerNavHelper = new RouterNavHelper()
export default routerNavHelper