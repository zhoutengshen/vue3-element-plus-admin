import type { RouteRecordRaw } from 'vue-router'
import DEFAULT_LAYOUT from '@/layout/default.vue'
const USER_ROUTES: RouteRecordRaw[] = [
  {
    path: '/user',
    component: DEFAULT_LAYOUT,
    redirect: '/user/info',
    meta: {
      title: '用户',
    },
    children: [
      {
        path: 'info',
        component: () => import('@/views/user/info/index.vue'),
        meta: {
          roles: ['user', 'admin'],
          title: '个人信息',
        },
      },
    ],
  },
]

export default USER_ROUTES
