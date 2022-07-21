import type { AxiosResponse } from 'axios'
import { getRequest } from './request'

const REQUEST_URL = {
  anonimous: '/register/anonimous',
}

export const convertloginAnonimous = async(res: AxiosResponse<any>): Promise<string[]> => {
  const cookie = res.data.cookie
  const newCookie = cookie.split(';;').map((item: any) => `${item};`)
  return newCookie
}

export const loginAnonimous = (params = {}) => {
  return getRequest(REQUEST_URL.anonimous, params).then(convertloginAnonimous)
}
