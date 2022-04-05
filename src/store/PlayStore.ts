import { defineStore } from 'pinia'

export const usePlayStore = defineStore({
  id: 'playStore',
  state: () => {
    return {
      location: '',
      isMusicChanged: false,
      isPlaying: false,
    }
  },
  actions: {
    musicChanged() {
      this.isMusicChanged = !this.isMusicChanged
    },
  },
  getters: {
  },
})
