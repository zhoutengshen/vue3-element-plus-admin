import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { AppConfig } from '@/configs/app'
import { getToken } from '@/utils/auth'
import { ApiCode } from '@/constant/request'

/**
 * Put Get Post 使用函数重载，根据条件返回不同的类型
 */
class ApiService {
  private _axiosInstance: AxiosInstance

  constructor() {
    this._axiosInstance = axios.create({
      baseURL: AppConfig.API_BASE_URL,
    })
    this.useInterceptors(this._axiosInstance)
  }

  public get axiosInstance() {
    return this._axiosInstance
  }

  public async post<T = any>(url: string, data: any, config?: AxiosRequestConfig<T>): Promise<T>
  public async post<T = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfigWithRespWrap<T>,
  ): Promise<ApiResponse<T>>
  public async post<T = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfigWithRespWrap<T>,
  ): Promise<ApiResponse<T> | T> {
    const resp = await this._axiosInstance.post(url, data, config)
    if (config?.withRespWrap) {
      return resp.data
    } else {
      return resp.data.data
    }
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig<T>): Promise<T>
  public async get<T = any>(url: string, config?: AxiosRequestConfigWithRespWrap<T>): Promise<ApiResponse<T>>
  public async get<T = any>(url: string, config?: AxiosRequestConfigWithRespWrap<T>): Promise<ApiResponse<T> | T> {
    const resp = await this._axiosInstance.get(url, config)
    if (config?.withRespWrap) {
      return resp.data
    } else {
      return resp.data.data
    }
  }

  public async put<T = any>(url: string, data: any, config?: AxiosRequestConfig<T>): Promise<T>
  public async put<T = any>(url: string, data: any, config?: AxiosRequestConfigWithRespWrap<T>): Promise<ApiResponse<T>>
  public async put<T = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfigWithRespWrap<T>,
  ): Promise<ApiResponse<T> | T> {
    const resp = await this._axiosInstance.put(url, data, config)
    if (config?.withRespWrap) {
      return resp.data
    } else {
      return resp.data.data
    }
  }

  private useInterceptors(instance: AxiosInstance) {
    instance.interceptors.request.use((reqConfig) => {
      if (reqConfig.headers) {
        reqConfig.headers['Authorization'] = getToken()
      }

      return reqConfig
    })
    instance.interceptors.response.use((resp: AxiosResponse<ApiResponse<any>>) => {
      const { data: respData } = resp
      if (respData.code !== ApiCode.SUCCESS) {
        window.alert(respData.msg)
        return Promise.reject(respData.msg)
      }
      return Promise.resolve(resp)
    })
  }
}

export default new ApiService()
