import usePlay from '@/hooks/usePlay'
import { getSongDetail } from '@/api/getSongDetail'
import { useMusicQueueStore } from '@/store/MusicQueueStore'
import { getSongListDetail } from '@/api/songlistAPI/getSongListInfo'

export default function useSongList() {
  const MUSIC_QUEUE_STORE = useMusicQueueStore()
  const { getMusicInfo } = usePlay()
  const { changeNowIndexTo, addToQueueWith } = MUSIC_QUEUE_STORE
  async function playSongList(trackIds: Number[]) {
    let allMusic: Music[] = []
    if (trackIds.length !== 0) {
      for (let i = 0; i < Math.ceil(trackIds.length / 200); i++) {
        await getSongDetail({
          ids: trackIds.slice(i * 200, (i + 1) * 200).join(','),
          realIP: '116.25.146.177',
        }).then((res) => {
          allMusic = allMusic.concat(res)
        })
      }
    }
    if (allMusic.length > 0) {
      MUSIC_QUEUE_STORE.resetQueue()
      for (const music of allMusic)
        addToQueueWith(music)
      changeNowIndexTo(0)
      getMusicInfo(allMusic[0], 'queue')
      return
    }
    ElMessage({
      type: 'error',
      message: '网络好像有点问题，刷新下试试？',
      showClose: true,
    })
  }
  async function playSongListById(id: Number) {
    await getSongListDetail({
      id,
      realIP: '116.25.146.177',
    }).then((res) => {
      return res.trackIds
    }).then((res) => {
      playSongList(res)
    })
  }
  return {
    playSongList,
    playSongListById,
  }
}
