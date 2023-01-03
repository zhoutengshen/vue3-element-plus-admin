import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'
import { NOT_ACCESS_PAGE_NAME } from '../constant'
import { useUserStore } from '@/stores'

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
// 权限访问拦截
const permissionGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const { meta } = to
  const userStore = useUserStore()
  if (checkPromise(meta.roles || [], userStore.roles)) {
    next()
  } else {
    next({
      ...to,
      name: NOT_ACCESS_PAGE_NAME,
    })
  }
}

export const setupPermissionGuard = (router: Router) => {
  router.beforeEach(permissionGuard)
}
