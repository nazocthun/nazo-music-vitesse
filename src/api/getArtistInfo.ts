import type { AxiosResponse } from 'axios'
import { getRequest } from './request'
import { durationTimeFormat, formatDate, getCompressedImgUrl, playCountMinimize } from '@/utils/common'

const REQUEST_URL = {
  info: '/artists',
  similar: '/simi/artist',
  album: '/artist/album',
  introduction: '/artist/desc',
  mv: '/artist/mv',
}

export const convertArtistInfo = async(res: AxiosResponse<any>): Promise<ArtistInfo> => {
  const artistInfo = res.data.artist
  const hotMusic = res.data.hotSongs
  return {
    name: artistInfo.name,
    id: artistInfo.id,
    picUrl: getCompressedImgUrl(artistInfo.img1v1Url, 500),
    briefDesc: artistInfo.briefDesc,
    albumSize: artistInfo.albumSize,
    musicSize: artistInfo.musicSize,
    hotMusic: hotMusic.map((item: { id: any; name: any; al: { picUrl: string; id: any; name: any }; ar: { id: any; name: any; alia: any }[]; dt: number }) => {
      return {
        id: item.id,
        name: item.name,
        picUrl: getCompressedImgUrl(item.al.picUrl, 500),
        artists: item.ar.map((item: { id: any; name: any; alia: any }) => {
          return {
            id: item.id,
            name: item.name,
            alias: item.alia,
          }
        }),
        album: {
          id: item.al.id,
          name: item.al.name,
        },
        duration: item.dt,
        time: durationTimeFormat(item.dt),
      }
    }),
  }
}

export const getArtistInfo = (params = {}) => {
  return getRequest(REQUEST_URL.info, params).then(convertArtistInfo)
}

export const convertArtistHotAlbum = async(res: AxiosResponse<any>): Promise<Array<Album>> => {
  const hotAlbum = res.data.hotAlbums
  return hotAlbum.map((item: { id: any; name: any; size: any; picUrl: string; artist: { id: any; name: any }; publishTime: Date }) => {
    return {
      id: item.id,
      name: item.name,
      size: item.size,
      picUrl: getCompressedImgUrl(item.picUrl, 500),
      artist: {
        id: item.artist.id,
        name: item.artist.name,
      },
      publishTime: formatDate(new Date(item.publishTime)),
    }
  })
}

export const getArtistHotAlbum = (params = {}) => {
  return getRequest(REQUEST_URL.album, params).then(convertArtistHotAlbum)
}

export const getArtist = (params = {}) => {
  return Promise.all([getArtistInfo(params), getArtistHotAlbum(params)]).then((res) => {
    const artistInfo = res[0]
    artistInfo.hotAlbum = res[1]
    return artistInfo
  })
}

export const convertSimilarArtistInfo = async(res: AxiosResponse<any>): Promise<Array<Artist>> => {
  const similarArtist = res.data.artists
  return similarArtist.map((item: { id: any; name: any; img1v1Url: string }) => {
    return {
      id: item.id,
      name: item.name,
      picUrl: getCompressedImgUrl(item.img1v1Url, 500),
    }
  })
}

export const getSimilarArtistInfo = (params = {}) => {
  return getRequest(REQUEST_URL.similar, params).then(convertSimilarArtistInfo)
}

export const convertArtistIntroduction = async(res: AxiosResponse<any>): Promise<ArtistIntroduction> => {
  return {
    briefDesc: res.data.briefDesc,
    introduction: res.data.introduction.map((item: { ti: any; txt: string }) => {
      return {
        title: item.ti,
        txt: item.txt.split(/[\n]/),
      }
    }),
  }
}

export const getArtistIntroduction = (params = {}) => {
  return getRequest(REQUEST_URL.introduction, params).then(convertArtistIntroduction)
}

export const convertArtistMV = async(res: AxiosResponse<any>): Promise<Array<MV>> => {
  const mvs = res.data.mvs

  return mvs.map((item: { name: any; id: any; imgurl16v9: string; picUrl: string; artist: { id: any; name: any }; playCount: any; publishTime: any; duration: number }) => {
    return {
      name: item.name,
      id: item.id,
      picUrl: getCompressedImgUrl(item.imgurl16v9 ? item.imgurl16v9 : 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg', 640, 'landscape'),
      artist: {
        id: item.artist.id,
        name: item.artist.name,
      },
      playCount: playCountMinimize(item.playCount),
      publishTime: item.publishTime,
      duration: item.duration,
      time: durationTimeFormat(item.duration),
    }
  })
}

export const getArtistMV = (params = {}) => {
  return getRequest(REQUEST_URL.mv, params).then(convertArtistMV)
}
