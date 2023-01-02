import { TOKEN_ID } from '@/constant'
import { getLocalStoreValue, setLocalStoreValue } from '.'

export const setToken = (token: string) => {
  setLocalStoreValue(TOKEN_ID, token)
}

export const getToken = () => {
  return getLocalStoreValue<string>(TOKEN_ID)
}

export const clearToken = () => {
  setLocalStoreValue(TOKEN_ID, null)
}

export const isLogin = () => {
  return !!getToken()
}
