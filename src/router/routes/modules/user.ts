import type { RouteRecordRaw } from 'vue-router'
import DEFAULT_LAYOUT from '@/layout/default.vue'
const USER_ROUTES: RouteRecordRaw[] = [
  {
    path: '/user',
    component: DEFAULT_LAYOUT,
    redirect: '/user/info',
    children: [
      {
        path: 'info',
        component: () => import('@/views/user/info/index.vue'),
        meta: {
          roles: ['user', 'admin'],
        },
      },
    ],
  },
]

export default USER_ROUTES
