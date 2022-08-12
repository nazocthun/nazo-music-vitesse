import type { AxiosResponse } from 'axios'
import { getRequest } from '../request'
import { durationTimeFormat, getCompressedImgUrl } from '@/utils/common'

const REQUEST_URL = {
  detail: 'song/detail',
}

export const convertSongDetail = async (res: AxiosResponse<any>): Promise<Music[]> => {
  const musicInfo = res.data.songs
  return musicInfo.map((item: { id: any; name: any; al: { picUrl: string; id: any; name: any }; ar: { id: any; name: any; alias: any }[]; dt: number }) => {
    return {
      id: item.id,
      name: item.name,
      picUrl: getCompressedImgUrl(item.al.picUrl, 500),
      artists: item.ar.map((item: { id: any; name: any; alias: any }) => {
        return {
          id: item.id,
          name: item.name,
          alias: item.alias,
        }
      }),
      album: {
        id: item.al.id,
        name: item.al.name,
      },
      duration: item.dt,
      time: durationTimeFormat(item.dt),
    }
  })
}

export const getSongDetail = (params = {}) => {
  return getRequest(REQUEST_URL.detail, params).then(convertSongDetail)
}
