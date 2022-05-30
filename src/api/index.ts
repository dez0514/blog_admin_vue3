import { service } from '../utils/fetch'
import qs from 'qs'
// 创建文件夹
export const postMkDir = (params: any) => {
  const data = qs.stringify(params)
  return service.post('/api/mkdir', data, {headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}

// 删除文件夹
export const postDeleteDir = (params: any) => {
  const data = qs.stringify(params)
  return service.post('/api/deletedir', data, {headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}

// 删除文件
export const postDeleteFile = (params: any) => {
  const data = qs.stringify(params)
  return service.post('/api/deletefile', data, {headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
// 批量删除文件
export const postDeleteFileMore = (params: any) => {
  const data = qs.stringify(params)
  return service.post('/api/deletefiles', data, {headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}

// 文件列表
export const getFileList = (params: any) => {
  const data = qs.stringify(params)
  return service.post('/api/filelist', data, {headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}

// 上传图片
export const postImgArray = (formData: any) => {
  return service.post('/api/upload', formData, {headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}