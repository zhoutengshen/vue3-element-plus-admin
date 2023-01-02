import { clearToken, isLogin, setToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { logout } from '@/api/user'
import type { UserState } from './types'
import { DefaultApiService } from '@/api'
import { useAppStore } from '@/stores'
const initStore = () => {
  return {
    roles: [],
    isLogin: isLogin(),
    name: undefined,
    uid: undefined,
    avatarUrl: undefined,
    desc: undefined,
  }
}
export const useUserStore = defineStore('user', {
  /** NOTE 实例化是必须显式声明字段，如果不声明，那么是不会观察数据变化的 */
  state(): UserState {
    return initStore()
  },
  actions: {
    async fetchUserInfo() {
      const userInfo = await DefaultApiService.getUserInfo()
      this.$patch(userInfo)
    },
    async login(username: string, psw: string): Promise<boolean> {
      if (this.isLogin) {
        console.error('不可重复登录')
        return false
      }
      const resp = await DefaultApiService.login(username, psw)
      setToken(resp.token)
      this.isLogin = isLogin()
      return this.isLogin
    },
    async logout() {
      if (!this.isLogin) {
        console.error('未登录不可退出')
        return
      }
      await logout()
      this.isLogin = false
      this.reset()
      useAppStore().reset()
    },
    reset() {
      clearToken()
      this.$reset()
    },
  },
})
