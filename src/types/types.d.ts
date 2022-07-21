declare interface Music {
  id: number // 歌曲id
  name: string // 歌曲名
  picUrl?: string // 专辑封面url
  alias?: string // 歌曲别名
  artists: ArtistSimple[] // 艺人简单信息
  album?: { // 专辑信息
    id: number
    name: string
  }
  duration?: number // 歌曲时长
  time?: string // 歌曲时长格式化
  mvId?: number // mv id
}

declare interface Album {
  id: number
  name: string
  size: number
  picUrl: string
  artist: ArtistSimple
  info?: {
    commentCount: number
  }
  publishTime?: number | string
  description?: string | string[]
  music?: Music[]
}

declare interface AlbumWrapper {
  album: Album[]
  more: boolean
}

declare interface MV {
  name: string
  id: number
  picUrl: string
  artist: ArtistSimple
  playCount: number | string
  maxr?: number
  publishTime?: string
  duration?: string
  time?: string
  desc?: string
}

declare interface albumTopInfoTypes {
  picUrl: string
  name: string
  musicSize: number
  albumSize: number
}

declare interface musicUrl {
  musicUrl: string
}

declare interface SongList {
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

declare interface SongListWrapper {
  songList: SongList[]
  lastTime?: number
  more: boolean
  total: number
}

declare interface User {
  userId: number
  nickname: string
  avatarUrl: string
}

declare interface MusicComment {
  user: User
  time: number
  timeStr: string
  beRepliedComment: beRepliedComment[]
  likedCount: number
  content: string
}

declare interface beRepliedComment {
  user: User
  content: string
}

declare interface Banner {
  imageUrl: string
  targetType: number
  targetId: number
}
