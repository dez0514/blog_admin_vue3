import { message } from 'ant-design-vue'
import axios from 'axios'
// import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { baseURL } from '../api/urls'
import { useLoading } from './useLoading'
const { setLoading } = useLoading()

const CONTENT_TYPE = {
  json: 'application/json;charset=utf-8',
  xwform: 'application/x-www-form-urlencoded',
}

const service = axios.create({
  baseURL, // api的base_url
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': CONTENT_TYPE.json,
  },
})

service.interceptors.request.use(
  (config: any) => {
    console.log('config===', config)
    if (config.isLoading) {
      setLoading(true)
    }
    // 在所有请求头部添加token值
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token
    }
    // if (config.headers && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    //   config.data = JSON.stringify(config.data)
    // }
    return config
  },
  error => {
    if (error.config.isLoading) {
      setLoading(false)
    }
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: any) => {
    console.log('response===', response)
    if (response.config.isLoading) {
      setLoading(false)
    }
    if (response && response.headers && response.headers.token) { // 接口响应头里带了token时，本地更新
      localStorage.setItem('token', response.headers.token)
    }
    // 成功请求到数据
    // console.log('response==', response)
    if (response && response.data && Number(response.data.code) === 417) {
      localStorage.clear()
      window.location.reload()
    }
    return Promise.resolve(response.data)
  },
  (error: any) => {
    if (error.config.isLoading) {
      setLoading(false)
    }
    // 响应错误处理
    if (axios.isCancel(error)) {
      // 取消请求的情况下，终端Promise调用链
      return { code: 1, message: '请求取消' }
    } else {
      return Promise.reject(error)
    }
  }
)

const CancelToken = axios.CancelToken
export { service, CancelToken, baseURL }
