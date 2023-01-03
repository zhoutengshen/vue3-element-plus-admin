import { isLogin } from '@/utils/auth'
import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'
import { useUserStore, useAppStore } from '@/stores'

const LOGIN_PAGE_PATH = '/login'

/** 白名单 */
const WHITE_LIST = [LOGIN_PAGE_PATH]
// 登录拦截
const userLoginGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const { path } = to

  // 已经登录
  if (isLogin()) {
    // 已经登录去登录页面
    if (path === LOGIN_PAGE_PATH) {
      next({
        ...to,
        name: '',
        path: '/',
      })
    } else {
      // 权限判断
      const userStore = useUserStore()
      const appStore = useAppStore()
      if (!userStore.roles.length) {
        try {
          await userStore.fetchUserInfo()
        } catch (e) {
          userStore.reset()
          appStore.reset()
          next({
            path: LOGIN_PAGE_PATH,
          })
          return
        }
      }
      next()
    }
  } else {
    if (WHITE_LIST.includes(path)) {
      next()
    } else {
      next({
        ...to,
        query: {
          ...to.query,
          redirect: path,
        },
        name: '',
        path: LOGIN_PAGE_PATH,
      })
    }
  }
}

export const setupUserLoginGuard = (router: Router) => {
  router.beforeEach(userLoginGuard)
}
