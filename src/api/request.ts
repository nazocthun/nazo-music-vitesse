import axios from 'axios'
import { ElMessage } from 'element-plus'

let baseURL = ''

if (process.env.NODE_ENV === 'development')
  baseURL = 'http://localhost:3000'
else
  baseURL = 'https://netease-cloud-music-api-eight-ivory.vercel.app'

const http = axios.create({
  baseURL,
  timeout: 5000,
})

http.interceptors.response.use(
  (response) => {
    if (response.status === 200)
      return Promise.resolve(response)
    else
      return Promise.reject(response)
  },
  (error) => {
    error && ElMessage({
      type: 'error',
      message: '网络好像有点问题，刷新下试试？',
      showClose: true,
    })
  },
)

export const getRequest = (url: string, params = {}) => {
  return http.get(url, { params: { ...params } })
}

export default http
