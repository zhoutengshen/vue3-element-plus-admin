import type { MenusRouteRecord } from '@/stores/modules/app/types'
import apiService from '@/utils/request'

/**
 * 获取侧边栏菜单配置
 * @returns
 */
export const getServerMenus = async () => {
  const resp = await apiService.get<MenusRouteRecord[]>('/api/user/menu')
  return resp
}

export const getUserInfo = async () => {
  const resp = await apiService.get<UserInfo>('/api/user-info')
  return resp
}

export const login = async (username: string, psw: string) => {
  const resp = await apiService.post<LoginInfo>('/api/login', { username, psw })
  return resp
}

export const logout = async () => {
  const resp = await apiService.post<boolean>('/api/logout', {})
  return resp
}
