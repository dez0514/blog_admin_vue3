import { service } from '../utils/fetch'
import qs from 'qs'
// 登录
export const login = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/user/login', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}