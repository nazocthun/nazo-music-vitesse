import type { AxiosResponse } from 'axios'
import { getRequest } from '../request'
import { durationTimeFormat, getCompressedImgUrl } from '@/utils/common'

const REQUEST_URL = {
  search: '/cloudsearch',
  suggest: '/search/suggest',
}

export const convertSearchMusic = async (res: AxiosResponse<any>): Promise<MusicSearchResult> => {
  const data = res.data.result
  if (data.songCount) {
    return {
      songCount: data.songCount,
      songs: data.songs.map((item: { id: any; name: any; ar: { id: any; name: any }[]; al: { id: any; name: any; picUrl: any }; dt: any }) => {
        return {
          id: item.id,
          name: item.name,
          artists: item.ar.map((artist: { id: any; name: any }) => {
            return {
              id: artist.id,
              name: artist.name,
            }
          }),
          picUrl: getCompressedImgUrl(item.al.picUrl, 500),
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
  else {
    return {
      songCount: data.songCount,
    }
  }
}

export const getSearchMusicResult = (params = {}) => {
  return getRequest(REQUEST_URL.search, params).then(convertSearchMusic)
}

export const convertSearchAlbum = async (res: AxiosResponse<any>): Promise<AlbumSearchResult> => {
  const data = res.data.result
  if (data.albumCount) {
    return {
      albumCount: data.albumCount,
      albums: data.albums.map((item: { id: any; name: any; picUrl: string; artist: { id: any; name: any } }) => {
        return {
          id: item.id,
          name: item.name,
          picUrl: getCompressedImgUrl(item.picUrl, 500),
          artist: {
            id: item.artist.id,
            name: item.artist.name,
          },
        }
      }),
    }
  }
  else {
    return {
      albumCount: data.albumCount,
    }
  }
}

export const getSearchAlbumResult = (params = {}) => {
  return getRequest(REQUEST_URL.search, params).then(convertSearchAlbum)
}

export const convertSearchSuggestFirst = async (res: AxiosResponse<any>): Promise<SearchSuggest> => {
  const data = res.data.result
  if (!data.order)
    return {} as SearchSuggest
  const order = data.order
  const result = {} as SearchSuggest
  order.forEach((item: keyof SearchSuggest) => {
    result[item] = data[item]
  })
  result.order = order
  return result
}

export const convertSearchSuggestSecond = (res: SearchSuggest): Promise<SearchSuggest> => {
  const data = res
  data.songs = data.songs?.map((songitem) => {
    return {
      id: songitem.id,
      name: songitem.name,
      artists: songitem.artists.map((artist) => {
        return {
          id: artist.id,
          name: artist.name,
        }
      }),
    }
  })
  data.artists = data.artists?.map((artistitem) => {
    return {
      id: artistitem.id,
      name: artistitem.name,
    }
  })
  data.albums = data.albums!.map((albumitem) => {
    return {
      id: albumitem.id,
      name: albumitem.name,
      artist: {
        id: albumitem.artist!.id,
        name: albumitem.artist!.name,
      },
    }
  })
  data.playlists = data.playlists?.map((songlistitem) => {
    return {
      id: songlistitem.id,
      name: songlistitem.name,
    }
  })
  return Promise.resolve(data)
}

export const getSearchSuggest = (params = {}) => {
  return getRequest(REQUEST_URL.suggest, params).then(convertSearchSuggestFirst).then(convertSearchSuggestSecond)
}
