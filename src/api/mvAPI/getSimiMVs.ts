import type { AxiosResponse } from 'axios'
import { getRequest } from '../request'
import { getCompressedImgUrl, playCountMinimize } from '@/utils/common'

const REQUEST_URL = {
  simi: '/simi/mv',
}

export const convertSimiMVs = async (res: AxiosResponse<any>): Promise<MV[]> => {
  const mvData = res.data.mvs
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

export const getSimiMVs = (params = {}) => {
  return getRequest(REQUEST_URL.simi, params).then(convertSimiMVs)
}
