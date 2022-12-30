import { isFunc } from '@/utils/is'
import { isProd } from '@/utils/env'

const isHookName = (name: string) => /use/.test(name)
export const useDevAllStore = () => {
  if (isProd()) {
    return
  }
  import('@/stores').then((resp: any) => {
    Object.keys(resp)
      .filter((key) => isHookName(String(key)))
      .forEach((key) => {
        if (isFunc(resp[key])) {
          resp[key]()
        }
      })
  })
}
