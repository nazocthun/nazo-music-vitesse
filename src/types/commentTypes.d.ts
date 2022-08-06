declare interface BeRepliedComment {
  user: User
  content: string
}

declare interface MusicComment {
  user: User
  time: number
  timeStr: string
  beRepliedComment: BeRepliedComment[]
  likedCount: number
  content: string
}

declare interface MusicCommentWrapper {
  comments: MusicComment[]
  totalCount: number
  cursor: number
}