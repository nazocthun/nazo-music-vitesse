import { acceptHMRUpdate, defineStore } from 'pinia'

export const useMusicQueueStore = defineStore('musicQueueStore', () => {
  const nowIndex = ref(0)
  const musicQueue = ref<Music[]>([])
  const musicHistory = ref<Music[]>([])
  const shuffleMusicIndex = ref<Number[]>([])
  const musicQueueStyle = ref('normal')
  const deleteToNext = ref(false)
  function changeQueueStyleTo(style: string) {
    musicQueueStyle.value = style
  }
  function changeNowIndexTo(index: number) {
    nowIndex.value = index
  }
  function addToQueueWith(music: Music) {
    musicQueue.value.push(music)
  }
  function addToHistoryWith(music: Music) {
    const index = musicHistory.value.findIndex(item => item.id === music.id)
    if (index !== -1)
      musicHistory.value.splice(index, 1)
    musicHistory.value.unshift(music)
  }
  function deleteMusicBy(id: number) {
    for (let i = 0; i < musicQueue.value.length; i++) {
      if (musicQueue.value[i].id === id)
        musicQueue.value.splice(i, 1)
    }
  }
  function getIndexByMusicId(id: number) {
    for (let i = 0; i < musicQueue.value.length; i++) {
      if (musicQueue.value[i].id === id)
        return i
    }
    return -1
  }
  function musicQueueHasMusicBy(id: number) {
    for (const music of musicQueue.value)
      if (music.id === id) return true
    return false
  }
  function toggleDeleteToNext() {
    deleteToNext.value = !deleteToNext.value
  }
  function resetQueue() {
    nowIndex.value = 0
    musicQueue.value = []
    musicQueueStyle.value = 'normal'
    deleteToNext.value = false
  }
  function resetMusicHistory() {
    musicHistory.value = []
  }
  return {
    nowIndex,
    musicQueue,
    musicHistory,
    shuffleMusicIndex,
    musicQueueStyle,
    deleteToNext,
    changeQueueStyleTo,
    changeNowIndexTo,
    addToQueueWith,
    addToHistoryWith,
    getIndexByMusicId,
    deleteMusicBy,
    musicQueueHasMusicBy,
    toggleDeleteToNext,
    resetQueue,
    resetMusicHistory,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMusicQueueStore, import.meta.hot))
