import { service } from '../utils/fetch'
import qs from 'qs'
// 创建文件夹
export const addArticle = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/add_article', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
// get传headers时则不需要和其他键分开大括号传
export const getArticles = (params: any = {}, config: any = {}) => {
  return service.get('/api/article_all_list', { params: params, ...config })
}