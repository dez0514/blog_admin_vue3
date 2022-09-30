import { service } from '../utils/fetch'
import qs from 'qs'
// 登录
export const login = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/user/login', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
// 注册
export const register = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/user/register', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}

export const getUserInfo = (params: any = {}, config: any = {}) => {
  return service.get('/api/user/userinfo', { params: params, ...config })
}

export const logout = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/user/logout', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
