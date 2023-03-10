import type { RouteRecordRaw } from 'vue-router'
import * as ROUTES_CONSTANT from '@/router/constant'
import DefaultLayout from '@/layout/default.vue'
const BASE_ROUTES: RouteRecordRaw[] = [
  {
    path: '/',
    alias: ['/home'],
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: ROUTES_CONSTANT.LOGIN_PAGE_NAME,
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/exception',
    component: DefaultLayout,
    children: [
      {
        path: '403',
        name: ROUTES_CONSTANT.NOT_ACCESS_PAGE_NAME,
        component: () => import('@/views/exception/403/index.vue'),
      },
      {
        path: '500',
        name: ROUTES_CONSTANT.SERVER_ERROR_PAGE_NAME,
        component: () => import('@/views/exception/403/index.vue'),
      },
      {
        path: '404',
        name: ROUTES_CONSTANT.NOT_FOUND_PAGE_NAME,
        component: () => import('@/views/exception/404/index.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTES_CONSTANT.NOT_FOUND_PAGE_NAME,
    component: () => import('@/views/exception/404/index.vue'),
  },
]
export { BASE_ROUTES }
