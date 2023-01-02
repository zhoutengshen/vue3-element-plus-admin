import type { RouteRecordRaw } from 'vue-router'
import DEFAULT_LAYOUT from '@/layout/default.vue'
import { Stopwatch } from '@element-plus/icons-vue'
const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: DEFAULT_LAYOUT,
    meta: {
      title: '仪表板',
      icon: Stopwatch,
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
