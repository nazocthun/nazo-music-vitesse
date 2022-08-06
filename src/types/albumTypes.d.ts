declare interface AlbumWrapper { // 专辑包装器
  album: Album[]
  more: boolean
}

declare interface Album { // 专辑
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

declare interface AlbumSimple {
  id: number
  name: string
  artist?: ArtistSimple
}