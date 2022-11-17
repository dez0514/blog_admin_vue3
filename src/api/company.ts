import { service } from '../utils/fetch'
import qs from 'qs'
// patch add tag
export const addCompanyList = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/company/add_company_list', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
// add tag
export const addCompany = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/company/add_company', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
// tag all list
export const getCompanys = (params: any = {}, config: any = {}) => {
  return service.get('/api/company/company_list', { params: params, ...config })
}

// delete tag
export const deleteCompany = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/company/delete_company', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
