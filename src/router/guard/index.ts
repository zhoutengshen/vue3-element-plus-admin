import type { Router } from 'vue-router'
import { setupPermissionGuard } from './permission'
import { setupUserLoginGuard } from './user-login'
import NProgress from 'nprogress'

export const setupGuard = (router: Router) => {
  router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
  })
  setupUserLoginGuard(router)
  setupPermissionGuard(router)
  router.afterEach(() => {
    NProgress.done()
  })
  return router
}
