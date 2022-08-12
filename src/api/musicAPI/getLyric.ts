import type { AxiosResponse } from 'axios'
import { getRequest } from '../request'

const REQUEST_URL = {
  lyric: '/lyric',
}

export const convertLyric = async (res: AxiosResponse<any>): Promise<Lyric[]> => {
  const rawLyric = res.data.lrc.lyric
  const lyrics: Lyric[] = []
  rawLyric.split('\n').forEach((lyric: string) => {
    const timeMatchs = lyric.match(/\[(\d{2}):(\d{2})\.(\d{2,3})]/)
    if (timeMatchs) {
      const content = lyric.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '')
      const minute = Number(timeMatchs[1])
      const second = Number(timeMatchs[2])
      const millisecond = Number(timeMatchs[3])
      const time = minute * 60 + second + millisecond / 1000
      lyrics.push({
        time,
        content,
      })
    }
    else {
      lyrics.push({
        time: 0,
        content: lyric,
      })
    }
  })
  return lyrics
}

export const getLyric = (params = {}) => {
  return getRequest(REQUEST_URL.lyric, params).then(convertLyric)
}
