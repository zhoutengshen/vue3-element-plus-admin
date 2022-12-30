import type { Router } from 'vue-router'
import { setupPermissionGuard } from './permission'
import { setupUserLoginGuard } from './user-login'

export const setupGuard = (router: Router) => {
  setupPermissionGuard(router)
  setupUserLoginGuard(router)
  return router
}
