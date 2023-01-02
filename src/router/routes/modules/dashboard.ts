import type { RouteRecordRaw } from 'vue-router'
import DEFAULT_LAYOUT from '@/layout/default.vue'
const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: DEFAULT_LAYOUT,
    meta: {
      title: '仪表板',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          roles: ['*'],
          title: '仪表板',
        },
      },
    ],
  },
]
export default dashboardRoutes
