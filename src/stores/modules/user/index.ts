import { clearToken, isLogin, setToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { logout } from '@/api/user'
import type { UserState } from './types'
import { DefaultApiService } from '@/api'
export const useUserStore = defineStore('user', {
  state(): UserState {
    return {
      roles: [],
      isLogin: isLogin(),
    }
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
      clearToken()
    },
    reset() {
      clearToken()
      this.$reset()
    },
  },
})
