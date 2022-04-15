import type { AxiosResponse } from 'axios'
import { getRequest } from './request'
import { formatDate, getCompressedImgUrl } from '@/utils/common'

const REQUEST_URL = {
  selfmade: '/top/playlist',
  selected: '/top/playlist/highquality',
  tracks: '/playlist/track/all',
  detail: '/playlist/detail',
}

export const convertSelectedSongList = async(res: AxiosResponse<any>): Promise<SongListWrapper> => {
  const songListInfo = res.data.playlists
  return {
    songList: songListInfo.map((item: { name: any; id: any; coverImgUrl: string; trackCount: any }) => {
      return {
        name: item.name,
        id: item.id,
        picUrl: getCompressedImgUrl(item.coverImgUrl, 500),
        trackCount: item.trackCount,
      }
    }),
    lastTime: res.data.lasttime,
    more: res.data.more,
    total: res.data.total,
  }
}

export const getSelectedSongList = (params = {}) => {
  return getRequest(REQUEST_URL.selected, params).then(convertSelectedSongList)
}

export const convertSongListDetail = async(res: AxiosResponse<any>): Promise<SongList> => {
  const songListInfo = res.data.playlist
  return songListInfo.map((item: { id: any; name: any; coverImgUrl: string; userId: any; description: any; tags: any; trackCount: any; createTime: string | number | Date; trackIds: { id: any }[] }) => {
    return {
      id: item.id,
      name: item.name,
      picUrl: getCompressedImgUrl(item.coverImgUrl, 500),
      userId: item.userId,
      description: item.description,
      tags: item.tags,
      trackCount: item.trackCount,
      createTime: formatDate(new Date(item.createTime)),
      trackIds: item.trackIds.map((item: { id: any }) => {
        return item.id
      }),
    }
  })
}

export const getSongListDetail = (params = {}) => {
  return getRequest(REQUEST_URL.detail, params).then(convertSongListDetail)
}
