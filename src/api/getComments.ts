import type { AxiosResponse } from 'axios'
import { getRequest } from './request'

const REQUEST_URL = {
  comment: '/comment/new',
  hotComment: '/comment/hot',
  albumCommentCount: '/album/detail/dynamic',
}

export const convertHotComment = async (res: AxiosResponse<any>): Promise<MusicComment[]> => {
  const hotCommentList = res.data.hotComments
  return hotCommentList.map((item: { user: { userId: any; nickname: any; avatarUrl: any }; commentId: any; content: any; time: any; timeStr: any; likedCount: any; beReplied: { user: { userId: any; nickname: any; avatarUrl: any }; content: any }[] }) => {
    return {
      user: {
        userId: item.user.userId,
        nickname: item.user.nickname,
        avatarUrl: item.user.avatarUrl,
      },
      commentId: item.commentId,
      content: item.content,
      time: item.time,
      timeStr: item.timeStr,
      likedCount: item.likedCount,
      beRepliedComment: item.beReplied === null
        ? []
        : item.beReplied.map((item: { user: { userId: any; nickname: any; avatarUrl: any }; content: any }) => {
          return {
            user: {
              userId: item.user.userId,
              nickname: item.user.nickname,
              avatarUrl: item.user.avatarUrl,
            },
            content: item.content,
          }
        }),
    }
  })
}

export const getHotComment = (params = {}) => {
  return getRequest(REQUEST_URL.hotComment, params).then(convertHotComment)
}

export const convertComment = async (res: AxiosResponse<any>): Promise<MusicComment[]> => {
  const commentList = res.data.data.comments
  return commentList.map((item: { user: { userId: any; nickname: any; avatarUrl: any }; commentId: any; content: any; time: any; timeStr: any; likedCount: any; beReplied: { user: { userId: any; nickname: any; avatarUrl: any }; content: any }[] }) => {
    return {
      user: {
        userId: item.user.userId,
        nickname: item.user.nickname,
        avatarUrl: item.user.avatarUrl,
      },
      commentId: item.commentId,
      content: item.content,
      time: item.time,
      timeStr: item.timeStr,
      likedCount: item.likedCount,
      beRepliedComment: item.beReplied === null
        ? []
        : item.beReplied.map((item: { user: { userId: any; nickname: any; avatarUrl: any }; content: any }) => {
          return {
            user: {
              userId: item.user.userId,
              nickname: item.user.nickname,
              avatarUrl: item.user.avatarUrl,
            },
            content: item.content,
          }
        }),
    }
  })
}

export const getComment = (params = {}) => {
  return getRequest(REQUEST_URL.comment, params).then(convertComment)
}

export const convertAlbumCommentCount = async(res: AxiosResponse<any>): Promise<number> => {
  const count = res.data.commentCount
  return count
}

export const getAlbumCommentCount = (params = {}) => {
  return getRequest(REQUEST_URL.albumCommentCount, params).then(convertAlbumCommentCount)
}
