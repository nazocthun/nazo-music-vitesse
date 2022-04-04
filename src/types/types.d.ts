declare interface Music {
  id: number // 歌曲id
  name: string // 歌曲名
  picUrl?: string // 专辑封面url
  alias?: string // 歌曲别名
  artists: Artist[] // 艺人信息
  album?: { // 专辑信息
    id: number
    name: string
  }
  duration?: number // 歌曲时长
  time?: string // 歌曲时长格式化
  mvId?: number // mv id
}

declare interface Artist {
  id: number // 艺人id
  name: string // 艺人名
  alias?: string // 艺人别名
  picUrl?: string // 艺人图片
}

declare interface ArtistInfo {
  name: string
  id: number
  picUrl: string
  briefDesc?: string
  albumSize: number
  musicSize: number
  hotMusic?: Music[]
  hotAlbum?: Album[]
}

declare interface Album {
  id: number
  name: string
  size: number
  picUrl: string
  artist: Artist
  info?: {
    commentCount: number
  }
  publishTime?: number | string
  description?: string | string[]
  music?: Music[]
}

declare interface ArtistIntroduction {
  briefDesc: string
  introduction: Array<{
    title: string
    txt: Array<string>
  }>
}

declare interface MV {
  name: string
  id: number
  picUrl: string
  artist: Artist
  playCount: number | string
  publishTime?: string
  duration?: string
  time?: string
}

declare interface albumTopInfoTypes {
  picUrl: string
  name: string
  musicSize: number
  albumSize: number
}

declare interface similarArtistTypes {
  id: number
  name: string
  picUrl: string
}

declare interface musicUrl {
  musicUrl: string
}
