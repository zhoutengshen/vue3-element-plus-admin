import { isProd } from '@/utils/env'
export const startMockIfDev = () => {
  if (isProd()) {
    return
  }
  import('mockjs').then(async ({ setup }) => {
    const { setupUser } = await import('./user')
    setupUser()
    setup({})
  })
}
