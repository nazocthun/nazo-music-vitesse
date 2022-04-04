import { storeToRefs } from 'pinia'
import { useMusicQueueStore } from '@/store/MusicQueueStore'
import { useMusicInfoStore } from '@/store/MusicInfoStore'
import { usePlayStore } from '@/store/PlayStore'

export default function useMusicQueue() {
  const MUSIC_INFO_STORE = useMusicInfoStore()
  const MUSIC_QUEUE_STORE = useMusicQueueStore()
  const PLAY_STORE = usePlayStore()
  const { musicQueue, nowIndex } = storeToRefs(MUSIC_QUEUE_STORE)
  const { changQueueStyleTo, changeNowIndexTo, addToQueueWith } = MUSIC_QUEUE_STORE
  const { musicChanged } = PLAY_STORE

  function addToQueue(music: Music, from: 'doubleclick' | 'plus' | 'queue') {
    if (from === 'queue') {
      changeNowIndexBy(music.id)
      return
    }
    const ids: number[] = []
    for (const item of musicQueue.value)
      ids.push(item.id)
    if (ids.includes(music.id)) {
      if (from === 'plus') {
        ElMessage({
          type: 'warning',
          message: `${music.name} 已经在播放列表中了`,
          showClose: true,
        })
      }
      if (from === 'doubleclick')
        musicChanged()
      return
    }
    setTimeout(() => {
      changQueueStyleTo('add')
      addToQueueWith(music)
      if (from === 'doubleclick')
        changeNowIndexBy(music.id)
    }, 500)
    setTimeout(() => {
      changQueueStyleTo('normal')
    }, 1000)
  }

  function prevQueue() {
    if (musicQueue.value.length === 0) { // 若队列没有歌曲 弹窗
      ElMessage({
        type: 'warning',
        message: '队列中没有歌曲',
        showClose: true,
      })
      return false
    }
    if (musicQueue.value.length === 1) { // 若队列只有一首歌 则重头开始播放
      musicChanged()
      return false
    }
    // 如果播放第一首歌 回到队列最后一首
    // 否则播放下一首
    const prevIndex = nowIndex.value === 0 ? musicQueue.value.length - 1 : nowIndex.value - 1
    changeNowIndexTo(prevIndex)
    return true
  }

  function nextQueue() {
    if (musicQueue.value.length === 0) {
      ElMessage({
        type: 'warning',
        message: '队列中没有歌曲',
        showClose: true,
      })
      return false
    }
    if (musicQueue.value.length === 1) { // 若播放列表只有一首歌 则停止播放
      changeNowIndexTo(0)
      MUSIC_INFO_STORE.$reset()
      ElMessage({
        type: 'warning',
        message: '队列播放完了',
        showClose: true,
      })
      return false
    }
    const nextIndex = (nowIndex.value + 1) % musicQueue.value.length
    changeNowIndexTo(nextIndex)
    return true
  }

  function changeNowIndexBy(musicId: number) {
    const ids: number[] = []
    for (const item of musicQueue.value)
      ids.push(item.id)
    changeNowIndexTo(ids.indexOf(musicId))
  }

  return {
    addToQueue,
    prevQueue,
    nextQueue,
    changeNowIndexBy,
  }
}
