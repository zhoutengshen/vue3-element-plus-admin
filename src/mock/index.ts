import { isProd } from '@/utils/env'
import { setup } from 'mockjs'
import { setupUser } from './user'
export const startMockIfDev = () => {
  if (isProd()) {
    return
  }
  setupUser()
  setup({})
}
