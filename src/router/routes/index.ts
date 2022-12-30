import type { RouteRecordRaw } from 'vue-router'
import { MODULES_ROUTES } from './modules'
import { BASE_ROUTES } from './base'

const ALL_ROUTES: RouteRecordRaw[] = [...MODULES_ROUTES, ...BASE_ROUTES]

export { MODULES_ROUTES, BASE_ROUTES }

export default ALL_ROUTES
