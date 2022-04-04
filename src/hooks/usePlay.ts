import { getMusicUrl } from '../api/getMusicUrl'
import useMusicQueue from './useMusicQueue'
import { useMusicInfoStore } from '@/store/MusicInfoStore'
import { usePlayStore } from '@/store/PlayStore'

export default function usePlay() {
  const { addToQueue } = useMusicQueue()
  const MUSIC_INFO_STORE = useMusicInfoStore()
  const PLAY_STORE = usePlayStore()
  // 播放音乐
  const { musicChanged } = usePlayStore()

  function getMusicInfo(row: Music, from: 'doubleclick' | 'plus' | 'queue') {
    // console.log(row)
    // console.log(playType)
    PLAY_STORE.$patch((state) => {
      state.location = from
    })
    const params = {
      id: row.id,
      realIP: '116.25.146.177',
    }
    const musicInfo: Music = row
    getMusicUrl(params).then((res) => {
      const musicUrl = res.musicUrl
      MUSIC_INFO_STORE.$patch((state) => {
        state.currentMusicUrl = musicUrl
        state.currentMusicInfo = musicInfo
      })
    })
    addToQueue(row, from)
    musicChanged()
  }

  function rowDoubleClick(row: Music) {
    getMusicInfo(row, 'doubleclick')
  }

  function queueDoubleClick(row: Music) {
    getMusicInfo(row, 'queue')
  }

  return {
    getMusicInfo,
    rowDoubleClick,
    queueDoubleClick,
  }
}
