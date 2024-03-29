declare interface User {
  userId: number
  nickname: string
  avatarUrl: string
}

declare interface Banner {
  imageUrl: string
  targetType: number
  targetId: number
}

declare interface Lyric {
  time: number
  content: string
}