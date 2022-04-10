import { acceptHMRUpdate, defineStore } from 'pinia'

export const usePlayStore = defineStore('playStore', () => {
  const location = ref('')
  const isMusicChanged = ref(false)
  const isPlaying = ref(false)

  function musicChanged() {
    isMusicChanged.value = !isMusicChanged.value
  }
  function reset() {
    location.value = ''
    isMusicChanged.value = false
    isPlaying.value = false
  }
  return {
    location,
    isMusicChanged,
    isPlaying,
    musicChanged,
    reset,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlayStore, import.meta.hot))
