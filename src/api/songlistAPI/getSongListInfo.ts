import type { AxiosResponse } from 'axios'
import { getRequest } from '../request'
import { formatDate, getCompressedImgUrl } from '@/utils/common'

const REQUEST_URL = {
  selfmade: '/top/playlist',
  selected: '/top/playlist/highquality',
  tracks: '/playlist/track/all',
  detail: '/playlist/detail',
  selectedtags: 'playlist/highquality/tags',
  related: '/related/playlist',
}
// 获取相似歌单
export const convertSimilarSongList = async (res: AxiosResponse<any>): Promise<SongList[]> => {
  const songLists = res.data.playlists
  return songLists.map((item: { id: any; name: any; coverImgUrl: string; creator: { userId: any } }) => {
    return {
      id: item.id,
      name: item.name,
      picUrl: getCompressedImgUrl(item.coverImgUrl, 500),
      userId: item.creator.userId,
    }
  })
}

/**
 *
 * @param params.id 歌单id
 * @returns SongList[] 相似歌单列表
 */
export const getSimilarSongList = async (params = {}) => {
  return getRequest(REQUEST_URL.related, params).then(convertSimilarSongList)
}

// 获取精选歌单标签
export const convertSelectedTags = async (res: AxiosResponse<any>): Promise<String[]> => {
  const tags = res.data.tags
  return tags.map((item: { name: string }) => {
    return item.name
  })
}

/**
 *
 * @returns string[], 歌单标签
 */
export const getSelectedTags = (params = {}) => {
  return getRequest(REQUEST_URL.selectedtags, params).then(convertSelectedTags)
}

// 获取精选歌单
export const convertSelectedSongList = async (res: AxiosResponse<any>): Promise<SongListWrapper> => {
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

/**
 *
 * @param params.cat 标签
 * @param params.limit 数量
 * @param params.before 分页参数, 取上一页最后一个歌单的 updateTime 获取下一页数据
 * @returns SongListWrapper 精品歌单列表
 */
export const getSelectedSongList = (params = {}) => {
  return getRequest(REQUEST_URL.selected, params).then(convertSelectedSongList)
}

// 获取自定义歌单
export const convertSelfMadeSongList = async (res: AxiosResponse<any>): Promise<SongListWrapper> => {
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
    more: res.data.more,
    total: res.data.total,
  }
}

export const getSelfMadeSongList = (params = {}) => {
  return getRequest(REQUEST_URL.selfmade, params).then(convertSelfMadeSongList)
}

// 用 tracksID 获取歌单歌曲
export const convertSongListDetail = async (res: AxiosResponse<any>): Promise<SongList> => {
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

/**
 *
 * @param params.id string 歌单id
 * @returns SongList 歌单详情
 */
export const getSongListDetail = (params = {}) => {
  return getRequest(REQUEST_URL.detail, params).then(convertSongListDetail)
}
