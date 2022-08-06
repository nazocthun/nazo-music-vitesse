declare interface HotSearch {
  searchWord: string
  score: number
  content: string
  iconType: number 
  iconUrl?: string
}

declare interface SearchSuggest {
  songs?: Music[]
  artists?: ArtistSimple[]
  albums?: AlbumSimple[]
  playlists?: SongListSimple[]
  order: string[]
}

declare interface MusicSearchResult {
  songCount: number
  songs: Music[]
}

declare interface AlbumSearchResult {
  albumCount: number
  albums: Album[]
}