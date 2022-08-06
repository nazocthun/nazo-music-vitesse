import type { AxiosResponse } from 'axios'
import { getRequest } from './request'

const REQUEST_URL = {
  detail: '/user/detail',
}

export const convertUserDetail = async (res: AxiosResponse<any>): Promise<User> => {
  const profile = res.data.profile
  return {
    userId: profile.userId,
    nickname: profile.nickname,
    avatarUrl: profile.avatarUrl,
  }
}

export const getUserDetail = (params = {}) => {
  return getRequest(REQUEST_URL.detail, params).then(convertUserDetail)
}
