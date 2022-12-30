import type { ApiCode } from '@/constant/request'
import { AxiosRequestConfig } from 'axios'

//  必须在文件里面使用 export 或者 import 否者 global 不会应用到全局
// NOTE 当需要使用 ts 文件里面的声明（ApiCode）时，必须把（ApiCode）声明放到global 里面，否者其他的全局声明会失效
declare global {
  interface ApiResponse<T = any> {
    code?: ApiCode
    data?: T
    msg?: string
  }

  type AxiosRequestConfigWithRespWrap<T> = AxiosRequestConfig<T> & {
    /** 是否使用ApiResponse 包裹 */
    withRespWrap: true
  }

  interface IApiResponse {
    post<T>(
      url: string,
      data: any,
      config: AxiosRequestConfig<T>,
    ): typeof config.withOriginResp extends never ? Promise<T> : Promise<ApiResponse<T>>
  }
}
export {}
