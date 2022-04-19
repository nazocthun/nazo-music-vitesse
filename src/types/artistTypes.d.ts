declare interface ArtistSimple { // 艺人简单信息
  id: number // 艺人id
  name: string // 艺人名
  alias?: string // 艺人别名
  picUrl?: string // 艺人图片
}

declare interface Artist { // 艺人详细信息
  name: string
  id: number
  picUrl: string
  briefDesc?: string
  albumSize: number
  musicSize: number
}

declare interface ArtistInfo { // 艺人信息和热歌
  artist: Artist
  hotMusic?: Music[]
}

declare interface ArtistIntroduction { // 艺人简介
  briefDesc: string
  introduction: Array<{
    title: string
    txt: Array<string>
  }>
}
