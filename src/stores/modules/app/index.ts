import { defineStore } from 'pinia'
import { getServerMenus } from '@/api/user'
import type { AppState } from './types'
export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      // 服务端加载过来的侧边栏
      serverMenus: [],
      // 客户端根据权限过滤出来的侧边栏
      clientMenus: [],
    }
  },
  actions: {
    async fetchServerMenus() {
      const resp = await getServerMenus()
      this.serverMenus = resp || []
    },
  },
})
