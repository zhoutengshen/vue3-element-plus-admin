import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'
// 登录拦截
const userLoginGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  next()
}

export const setupUserLoginGuard = (router: Router) => {
  router.beforeEach(userLoginGuard)
}
