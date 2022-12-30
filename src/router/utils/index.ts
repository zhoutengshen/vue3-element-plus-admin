import * as ROUTES_CONSTANT from '@/router/constant'
import router from '@/router'
export const navToLogin = () => {
  router.replace({ name: ROUTES_CONSTANT.LOGIN })
}

export const navToHomePage = () => {
  router.replace({ path: '/home' })
}
