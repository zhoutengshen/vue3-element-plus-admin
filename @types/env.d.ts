/// <reference types="vite/client" />

declare global {
  type APP_ENV = 'production' | 'development' | 'staging'

  interface ImportMetaEnv {
    VITE_APP_ENV: APP_ENV
    VITE_BASE_URL: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
export {}
