import type { RouteRecordRaw } from 'vue-router'
import DEFAULT_LAYOUT from '@/layout/default.vue'
const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    alias: ['/home'],
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    component: DEFAULT_LAYOUT,
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          roles: ['*'],
        },
      },
    ],
  },
]
export default dashboardRoutes
