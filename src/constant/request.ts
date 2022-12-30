export enum ApiCode {
  SUCCESS = 200,
  INVALID_AUTH = 401,
  FAIL = 10000,
  LOGIN_FAIL = 10001,
}

export const ApiMsg: Record<ApiCode, string> = {
  [ApiCode.SUCCESS]: '成功',
  [ApiCode.FAIL]: '请求失败',
  [ApiCode.LOGIN_FAIL]: '登录失败',
  [ApiCode.INVALID_AUTH]: '无效的凭证',
}
