import type { AxiosResponse } from 'axios'
import { getRequest } from './request'

const REQUEST_URL = {
  songUrl: '/song/url',
}

export const convertMusicUrl = async(res: AxiosResponse<any>): Promise<musicUrl> => {
  return {
    musicUrl: res.data.data[0].url,
  }
}

export const getMusicUrl = (params = {}) => {
  return getRequest(REQUEST_URL.songUrl, params).then(convertMusicUrl)
}
