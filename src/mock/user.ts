import { ApiCode, ApiMsg } from '@/constant/request'
import Mock from 'mockjs'
const successRespWrap = <T = any>(rawResp: T): ApiResponse<T> => {
  return {
    data: rawResp,
    code: ApiCode.SUCCESS,
  }
}

const failRespWrap = (resp: ApiResponse): ApiResponse => {
  const code = resp.code || ApiCode.FAIL
  return {
    code: code,
    msg: resp.msg ? resp.msg : ApiMsg[code],
  }
}

const setupUser = () => {
  Mock.mock(RegExp('/api/user/menu'), () => {
    const menuList = [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          locale: 'menu.server.dashboard',
          requiresAuth: true,
          icon: 'icon-dashboard',
          order: 1,
        },
        children: [
          {
            path: 'workplace',
            name: 'Workplace',
            meta: {
              locale: 'menu.server.workplace',
              requiresAuth: true,
            },
          },
          {
            path: 'https://arco.design',
            name: 'arcoWebsite',
            meta: {
              locale: 'menu.arcoWebsite',
              requiresAuth: true,
            },
          },
        ],
      },
    ]
    return successRespWrap(menuList)
  })

  Mock.mock(RegExp('/api/login'), (params) => {
    console.log(params)

    const { username, psw } = JSON.parse(params.body)
    if (!username || !psw) {
      return failRespWrap({ code: ApiCode.FAIL, msg: '密码或用户名不能为空' })
    }
    // 密码表
    const usernamePswMap = {
      zhouTengShen: 'zhouTengShen',
      admin: 'admin',
    } as Record<string, string>
    if (usernamePswMap[username]) {
      return successRespWrap<LoginInfo>({ token: Mock.Random.string(12, 24) })
    } else {
      return failRespWrap({ code: ApiCode.FAIL, msg: '密码错误或者用户不存在' })
    }
  })

  Mock.mock(RegExp('/api/user-info'), (params) => {
    console.log(params, '=========')
    return successRespWrap<UserInfo>({
      roles: ['admin'],
      name: Mock.Random.name(),
      uid: Mock.Random.guid(),
    })
  })

  Mock.mock(RegExp('/api/logout'), () => {
    return successRespWrap<boolean>(true)
  })
}

export { setupUser }
