import type { RouteRecordRaw } from 'vue-router'
import * as ROUTES_CONSTANT from '@/router/constant'
const BASE_ROUTES: RouteRecordRaw[] = [
  {
    path: '/login',
    name: ROUTES_CONSTANT.LOGIN,
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/403',
    name: ROUTES_CONSTANT.NOT_ACCESS,
    component: () => import('@/views/exception/403/index.vue'),
  },
  {
    path: '/500',
    name: ROUTES_CONSTANT.SERVER_ERROR,
    component: () => import('@/views/exception/403/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTES_CONSTANT.NOT_FOUND,
    component: () => import('@/views/exception/404/index.vue'),
  },
]
export { BASE_ROUTES }
