import type { AxiosResponse } from 'axios'
import { getRequest } from '../request'

const REQUEST_URL = {
  search: '/cloudsearch',
  suggest: '/search/suggest',
}

export const convertSearch = async (res: AxiosResponse<any>): Promise<MusicSearchResult | AlbumSearchResult> => {
  const data = res.data.result
  if (data.songCount) {
    return {
      songCount: data.songCount,
      songs: data.songs.map((item: { id: any; name: any; ar: { id: any; name: any }[]; al: { id: any; name: any }; dt: any }) => {
        return {
          id: item.id,
          name: item.name,
          artists: item.ar.map((artist: { id: any; name: any }) => {
            return {
              id: artist.id,
              name: artist.name,
            }
          }),
          album: {
            id: item.al.id,
            name: item.al.name,
          },
          duration: item.dt,
        }
      }),
    }
  }
  else if (data.albumCount) {
    return {
      albumCount: data.albumCount,
      albums: data.albums.map((item) => {

      }),
    }
  }
}

export const getSearchResult = (params = {}) => {
  return getRequest(REQUEST_URL.search, params).then(convertSearch)
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
  data.albums = data.albums?.map((albumitem) => {
    return {
      id: albumitem.id,
      name: albumitem.name,
      artist: {
        id: albumitem.artist.id,
        name: albumitem.artist.name,
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
