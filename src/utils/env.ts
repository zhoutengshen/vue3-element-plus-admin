import { AppConfig } from '@/configs/app'
export const getEnv = (): APP_ENV => {
  return AppConfig.APP_ENV
}

export const isProd = (): boolean => {
  return getEnv() === 'production'
}
