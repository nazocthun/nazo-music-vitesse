import type { AxiosResponse } from 'axios'
import { getRequest } from '@/api/request'
import { durationTimeFormat, getCompressedImgUrl } from '@/utils/common'

const REQUEST_URL = '/top/song'

export const convertNewMusic = (res: AxiosResponse<any>): Music[] => {
  const data = res.data.data.slice(0, 50)
  if (!data || !data.length) return []
  return data.map((item: any) => {
    const { album, artists, duration, alias } = item
    return {
      id: item.id,
      name: item.name,
      picUrl: getCompressedImgUrl(album.picUrl, 200),
      alias: alias[0] || '',
      album: { id: album.id, name: album.name },
      artists: artists.map((item: Artist) => { return { id: item.id, name: item.name } }),
      duration,
      time: durationTimeFormat(duration),
      mvId: item.mvid,
    }
  })
}

export const getNewMusic = (params = {}) => {
  return getRequest(REQUEST_URL, params).then(convertNewMusic)
}
