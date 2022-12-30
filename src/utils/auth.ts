import { TOKEN_ID } from '@/constant'

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_ID, token)
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_ID)
}

export const clearToken = () => {
  setToken('')
}

export const isLogin = () => {
  return !!getToken()
}
