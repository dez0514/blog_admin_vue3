import { service } from '../utils/fetch'
import qs from 'qs'
// 创建文章
export const addArticle = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/article/add_article', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
// get传headers时则不需要和其他键分开大括号传
// 不分页
export const getArticles = (params: any = {}, config: any = {}) => {
  return service.get('/api/article/article_all_list', { params: params, ...config })
}
// 分页
export const getArticlesPage = (params: any = {}, config: any = {}) => {
  return service.get('/api/article/article_list', { params: params, ...config })
}

export const getArticleDetail = (params: any = {}, config: any = {}) => {
  return service.get('/api/article/article_detail', { params: params, ...config })
}
// 删除文章
export const deleteArticle = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/article/delete_article', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}