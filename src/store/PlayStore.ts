import { acceptHMRUpdate, defineStore } from 'pinia'

export const usePlayStore = defineStore('playStore', () => {
  const location = ref('')
  const isMusicChanged = ref(false)
  const isPlaying = ref(false)
  const playMode = ref('sequence')

  function musicChanged() {
    isMusicChanged.value = !isMusicChanged.value
  }
  function reset() {
    location.value = ''
    isPlaying.value = false
  }
  return {
    location,
    isMusicChanged,
    isPlaying,
    playMode,
    musicChanged,
    reset,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlayStore, import.meta.hot))
