import { isLogin } from '@/utils/auth'
import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'
import { useUserStore, useAppStore } from '@/stores'
import { NOT_ACCESS } from '@/router/constant'

const LOGIN_PAGE_PATH = '/login'

/** 权限检测，判断是否有页面访问的权限 */
const checkPromise = (needRoles: string[], ownRoles: string[]): boolean => {
  if (!needRoles.length) {
    return true
  }
  if (!ownRoles.length) {
    return false
  }
  let pageNotNeedPermission = false
  // 转换未hash 表，减少便利
  const needRoleMap = needRoles.reduce((pre, next) => {
    if (next === '*') {
      pageNotNeedPermission = true
    }
    pre[next] = true
    return pre
  }, {} as Record<string, boolean>)
  if (pageNotNeedPermission) {
    return true
  }
  return ownRoles.some((item) => '*' === item || needRoleMap[item])
}
/** 白名单 */
const WHITE_LIST = [LOGIN_PAGE_PATH]
// 登录拦截
const userLoginGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const { path, meta } = to

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
          console.log(e)
          userStore.reset()
          appStore.reset()
          next({
            path: LOGIN_PAGE_PATH,
          })
          return
        }
      }
      if (checkPromise(meta.roles || [], userStore.roles)) {
        next()
      } else {
        next({
          ...to,
          name: NOT_ACCESS,
        })
      }
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
