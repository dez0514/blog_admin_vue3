import { service } from '../utils/fetch'
import qs from 'qs'

export const saveResume = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/resume/save_resume', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
export const getResume = (params: any = {}, config: any = {}) => {
  return service.get('/api/resume/resume_detail', { params: params, ...config })
}

