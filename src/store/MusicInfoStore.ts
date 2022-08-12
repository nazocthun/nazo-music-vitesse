import { acceptHMRUpdate, defineStore } from 'pinia'

export const useMusicInfoStore = defineStore('musicInfoStore', () => {
  const currentMusicUrl = ref('')
  const currentMusicInfo = ref<Music>({} as Music)
  const currentMusicTime = ref(0)
  function reset() {
    currentMusicUrl.value = ''
    currentMusicInfo.value = {} as Music
    currentMusicTime.value = 0
  }
  return {
    currentMusicUrl,
    currentMusicInfo,
    currentMusicTime,
    reset,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMusicInfoStore, import.meta.hot))
