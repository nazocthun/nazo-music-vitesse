declare interface Music {
  id: number // 歌曲id
  name: string // 歌曲名
  picUrl?: string // 专辑封面url
  alias?: string // 歌曲别名
  artists: ArtistSimple[] // 艺人简单信息
  album?: AlbumSimple // 专辑信息
  duration?: number // 歌曲时长
  time?: string // 歌曲时长格式化
  mvId?: number // mv id
}

declare interface musicUrl {
  musicUrl: string
}