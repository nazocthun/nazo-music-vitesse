import type { AxiosResponse } from 'axios'
import { getRequest } from './request'
import { formatDate, getCompressedImgUrl } from '@/utils/common'

const REQUEST_URL = {
  songlist: '/personalized',
  mv: '/personalized/mv',
  newsong: '/personalized/newsong',
}

export const convertPersonalizedSongList = (res: AxiosResponse<any>): Promise<SongList[]> => {
  const songListInfo = res.data.result
  return songListInfo.map((item: { id: any; name: any; picUrl: string; trackCount: any; trackNumberUpdateTime: string | number | Date }) => {
    return {
      id: item.id,
      name: item.name,
      picUrl: getCompressedImgUrl(item.picUrl, 500),
      trackCount: item.trackCount,
      updateTime: formatDate(new Date(item.trackNumberUpdateTime)),
      // playCount: item.playCount,
    }
  })
}

export const getPersonalizedSongList = async(params = {}) => {
  return getRequest(REQUEST_URL.songlist, params).then(convertPersonalizedSongList)
}
