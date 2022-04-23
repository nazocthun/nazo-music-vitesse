// 公用函数
export function durationTimeFormat(duration: number): string {
  const min = Math.floor(duration / 60000).toString().padStart(2, '0')
  const second = Math.floor((duration % 60000) / 1000).toString().padStart(2, '0')
  return `${min}:${second}`
}

export function playControlTimeFormat(duration: number | undefined): string {
  if (typeof (duration) === 'undefined')
    return '00:00'
  const min = Math.floor(duration / 60).toString().padStart(2, '0')
  const second = Math.floor(duration % 60).toString().padStart(2, '0')
  return `${min}:${second}`
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getCompressedImgUrl(url: string, size: number, type: 'square' | 'landscape' = 'square'): string {
  if (type === 'landscape')
    return `${url}?param=${size}y${Math.floor(size / 16 * 9)}`
  return `${url}?param=${size}y${size}`
}

export function playCountMinimize(playCount: number): string {
  if (playCount < 10000)
    return playCount.toString()
  if (playCount < 100000000)
    return `${(playCount / 10000).toFixed(1)}万`
  return `${(playCount / 100000000).toFixed(1)}亿`
}

export function artistsTitleString(artists: ArtistSimple[]) {
  return artists.map(artist => artist.name).join(' & ')
}
