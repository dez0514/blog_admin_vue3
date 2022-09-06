import { service } from '../utils/fetch'
import qs from 'qs'
// patch add tag
export const addTagList = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/tag/add_taglist', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
// add tag
export const addTag = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/tag/add_tag', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
// tag all list
export const getAllTags = (params: any = {}, config: any = {}) => {
  return service.get('/api/tag/tag_all_list', { params: params, ...config })
}
// tag list
export const getTags = (params: any = {}, config: any = {}) => {
  return service.get('/api/tag/tag_list', { params: params, ...config })
}
// delete tag
export const deleteTag = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/tag/delete_tag', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
