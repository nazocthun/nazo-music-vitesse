import type { AxiosResponse } from 'axios'
import { getRequest } from './request'
import { getCompressedImgUrl, playCountMinimize } from '@/utils/common'

const REQUEST_URL = {
  all: '/mv/all',
}

export const convertAllMVs = async (res: AxiosResponse<any>): Promise<MV[]> => {
  const mvData = res.data.data
  return mvData.map((item: any) => {
    return {
      name: item.name,
      id: item.id,
      picUrl: getCompressedImgUrl(item.cover, 640, 'landscape'),
      artist: {
        id: item.artistId,
        name: item.artistName,
      },
      playCount: playCountMinimize(item.playCount),
    }
  })
}

export const getAllMVs = (params = {}) => {
  return getRequest(REQUEST_URL.all, params).then(convertAllMVs)
}
