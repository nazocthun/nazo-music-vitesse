import { acceptHMRUpdate, defineStore } from 'pinia'

export const useMusicQueueStore = defineStore('musicQueueStore', () => {
  const nowIndex = ref(0)
  const musicQueue = ref<Music[]>([])
  const shuffleMusicQueue = ref<Music[]>([])
  const musicQueueStyle = ref('normal')
  const deleteToNext = ref(false)
  const queuePlayStyle = ref('sequence')
  function changQueueStyleTo(style: string) {
    musicQueueStyle.value = style
  }
  function changeNowIndexTo(index: number) {
    nowIndex.value = index
  }
  function addToQueueWith(music: Music) {
    musicQueue.value.push(music)
  }
  function deleteMusicBy(id: number) {
    for (let i = 0; i < musicQueue.value.length; i++) {
      if (musicQueue.value[i].id === id)
        musicQueue.value.splice(i, 1)
    }
  }
  function toggleDeleteToNext() {
    deleteToNext.value = !deleteToNext.value
  }
  function toggleQueuePlayStyle() {
    const styles = ['sequence', 'loop', 'single-loop', 'shuffle']
    const position = styles.indexOf(queuePlayStyle.value)
    queuePlayStyle.value = styles[(position + 1) % styles.length]
  }
  function resetQueue() {
    nowIndex.value = 0
    musicQueue.value = []
    shuffleMusicQueue.value = []
    musicQueueStyle.value = 'normal'
    deleteToNext.value = false
  }
  return {
    nowIndex,
    musicQueue,
    shuffleMusicQueue,
    musicQueueStyle,
    deleteToNext,
    queuePlayStyle,
    changQueueStyleTo,
    changeNowIndexTo,
    addToQueueWith,
    deleteMusicBy,
    toggleDeleteToNext,
    toggleQueuePlayStyle,
    resetQueue,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMusicQueueStore, import.meta.hot))
