// import axios from 'axios'
// import { AxiosRequestConfig, AxiosResponse } from 'axios'
// import router from '../router'

// const baseURL = ''

// const CONTENT_TYPE = {
//     json: 'application/json;charset=utf-8',
//     xwform: 'application/x-www-form-urlencoded',
// }

// const service = axios.create({
//     baseURL, // api的base_url
//     timeout: 30000, // 请求超时时间
//     headers: {
//         'Content-Type': CONTENT_TYPE.json,
//     },
// })

// service.interceptors.request.use(
//     (config: AxiosRequestConfig) => {
//         // 在所有请求头部添加token值
//         const token = localStorage.getItem('token') // store.state.token;
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
//             config.data = JSON.stringify(config.data)
//         }
//         return config
//     },
//     error => {
//         return Promise.reject(error)
//     }
// )

// service.interceptors.response.use(
//     (response: { data: any }) => {
//         // 成功请求到数据
//         const data = response.data
//         if (data.code === 0) {
//             return data
//         } else {
//             if (data.code === 401) {
//                 router.push('/login')
//             }
//             return Promise.reject(data)
//         }
//     },
//     (error: { response: { status: number; data: { error: any } }; message: any }) => {
//         // 响应错误处理
//         if (error.response) {
//             if (error.response.status === 401) {
//                 router.push('/login')
//                 return Promise.reject({
//                     code: error.response.status,
//                     message: error.response.data.error,
//                 })
//             } else {
//                 return Promise.reject({
//                     code: error.response.status,
//                     message: error.message,
//                 })
//             }
//         } else {
//             if (axios.isCancel(error)) {
//                 // 取消请求的情况下，终端Promise调用链
//                 return { code: '-1', message: '请求取消' }
//             }
//             return Promise.reject({
//                 code: -1,
//                 message: '出错啦，请检查网络稍后再试',
//             })
//         }
//     }
// )

// const CancelToken = axios.CancelToken
// export { service, CancelToken, baseURL }
