import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'

// 权限访问拦截
const permissionGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  next()
}

export const setupPermissionGuard = (router: Router) => {
  router.beforeEach(permissionGuard)
}
