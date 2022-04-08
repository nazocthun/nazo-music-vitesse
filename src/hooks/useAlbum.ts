import { getAlbumInfo } from '@/api/getAlbumInfo'
import { useMusicQueueStore } from '@/store/MusicQueueStore'
import usePlay from '@/hooks/usePlay'

export default function useAlbum() {
  const MUSIC_QUEUE_STORE = useMusicQueueStore()
  const { getMusicInfo } = usePlay()
  const { changeNowIndexTo, addToQueueWith } = MUSIC_QUEUE_STORE
  async function playAlbum(id = 0, data = [] as Music[]) {
    let allMusic = data
    if (data.length === 0) {
      const params = {
        id,
        realIP: '116.25.146.177',
      }
      await getAlbumInfo(params).then((res) => {
        allMusic = res.music ?? []
      })
    }
    if (allMusic.length > 0) {
      MUSIC_QUEUE_STORE.$reset()
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
  return {
    playAlbum,
  }
}
