import { createPinia } from 'pinia'
export * from './modules/user/index'
export * from './modules/app/index'
export const pinia = createPinia()

export default pinia
