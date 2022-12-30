import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {}

  interface AxiosRequestConfigWithToken<T = any> extends AxiosRequestConfig<T> {
    headers?: Partial<
      RawAxiosRequestHeaders & {
        Authorization?: string
      }
    >
  }
}
