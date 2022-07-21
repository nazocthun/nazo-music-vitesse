import type { AxiosResponse } from 'axios'
import { getRequest } from './request'
import { getCompressedImgUrl, playCountMinimize } from '@/utils/common'

const REQUEST_URL = {
  url: '/mv/url',
  detail: '/mv/detail',
}

export const convertMVUrl = async (res: AxiosResponse<any>): Promise<string> => {
  return res.data.data.url
}

/**
 * 获取MV url
 * @param {string} params.id - mv id
 * @param {number} params.r  - 分辨率，默认1080p, 可从 /mv/detail接口获取分辨率列表
 * @returns {string}  mv url
 *
 */
export const getMVUrl = (params = {}) => {
  return getRequest(REQUEST_URL.url, params).then(convertMVUrl)
}

export const convertMVDetail = async (res: AxiosResponse<any>): Promise<MV> => {
  const mv = res.data.data
  return {
    name: mv.name,
    id: mv.id,
    picUrl: mv.cover,
    artist: {
      id: mv.artistId,
      name: mv.artistName,
      picUrl: mv.artists.map((item: { id: any; img1v1Url: any }) => {
        if (item.id === mv.artistId) return getCompressedImgUrl(item.img1v1Url, 500)
      }).shift(),
    },
    playCount:  playCountMinimize(mv.playCount),
    maxr: Math.max(...mv.brs.map((item: { br: any }) => item.br)),
    publishTime: mv.publishTime,
    desc: mv.desc,
  }
}

export const getMVDetail = (params = {}) => {
  return getRequest(REQUEST_URL.detail, params).then(convertMVDetail)
}
