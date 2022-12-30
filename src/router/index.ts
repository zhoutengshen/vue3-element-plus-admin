import { createRouter, createWebHistory } from 'vue-router'
import { setupGuard } from './guard'
import ALL_ROUTES from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...ALL_ROUTES],
})

export default setupGuard(router)
