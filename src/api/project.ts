import { service } from '../utils/fetch'
import qs from 'qs'

// add Project
export const addProject = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/project/add_project', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}
// Project all list
export const getAllProjects = (params: any = {}, config: any = {}) => {
  return service.get('/api/project/project_all_list', { params: params, ...config })
}

export const getPageProjects = (params: any = {}, config: any = {}) => {
  return service.get('/api/project/project_list', { params: params, ...config })
}

// delete Project
export const deleteProject = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/project/delete_project', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}

export const sortProjectData = (params: any = {}, config: any = {}) => {
  const data = qs.stringify(params)
  return service.post('/api/project/sort_project', data, { ...config, headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
}