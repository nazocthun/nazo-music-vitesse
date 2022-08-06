declare interface SongList { // 歌单
  id: number // 歌单id
  name: string // 歌单名
  trackCount?: number // 歌曲数量
  picUrl?: string // 歌单封面url
  userId?: string // 创建者id
  description?: string // 歌单描述
  playCount?: number // 播放次数
  tags?: string[] // 歌单标签
  publishTime?: number | string // 创建时间
  updateTime?: number | string // 更新时间
  trackIds: number[]
}

declare interface SongListSimple {
  id: number // 歌单id
  name: string // 歌单名
}

declare interface SongListWrapper { // 歌单包装器
  songList: SongList[]
  lastTime?: number
  more: boolean
  total: number
}