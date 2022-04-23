import type { AxiosResponse } from 'axios'
import { getRequest } from './request'
import { formatDate, getCompressedImgUrl } from '@/utils/common'

const REQUEST_URL = {
  selfmade: '/top/playlist',
  selected: '/top/playlist/highquality',
  tracks: '/playlist/track/all',
  detail: '/playlist/detail',
}

// 获取精选歌单
export const convertSelectedSongList = async(res: AxiosResponse<any>): Promise<SongListWrapper> => {
  const songListInfo = res.data.playlists
  return {
    songList: songListInfo.map((item: { name: any; id: any; coverImgUrl: string; trackCount: any; createTime: Date; updateTime: Date }) => {
      return {
        name: item.name,
        id: item.id,
        picUrl: getCompressedImgUrl(item.coverImgUrl, 500),
        trackCount: item.trackCount,
        publishTime: formatDate(new Date(item.createTime)),
        updateTime: formatDate(new Date(item.updateTime)),
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

// 用 tracksID 获取歌单歌曲
export const convertSongListDetail = async(res: AxiosResponse<any>): Promise<SongList> => {
  const songListInfo = res.data.playlist
  return {
    id: songListInfo.id,
    name: songListInfo.name,
    picUrl: getCompressedImgUrl(songListInfo.coverImgUrl, 500),
    userId: songListInfo.userId,
    description: songListInfo.description,
    tags: songListInfo.tags,
    trackCount: songListInfo.trackCount,
    publishTime: formatDate(new Date(songListInfo.createTime)),
    trackIds: songListInfo.trackIds.map((item: { id: any }) => {
      return item.id
    }),
  }
}

export const getSongListDetail = (params = {}) => {
  return getRequest(REQUEST_URL.detail, params).then(convertSongListDetail)
}
