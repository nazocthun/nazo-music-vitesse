import type { AxiosResponse } from 'axios'
import { getRequest } from './request'

const REQUEST_URL = {
  songUrl: '/song/url',
}

export const convertMusicUrl = async (res: AxiosResponse<any>): Promise<string[]> => {
  return res.data.data.map((item: { url: any }) => item.url)
}

/**
 * 获取音乐url
 * @param {string} params.id - 音乐 id 多个可用,分隔
 * @param {number} params.br  - 码率，默认999000
 * @returns {string[]}  音乐 url 列表
 *
 */
export const getMusicUrl = (params = {}) => {
  return getRequest(REQUEST_URL.songUrl, params).then(convertMusicUrl)
}
