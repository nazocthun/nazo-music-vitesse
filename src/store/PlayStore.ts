import { defineStore } from 'pinia'

export const usePlayStore = defineStore({
  id: 'playStore',
  state: () => {
    return {
      location: '',
      isMusicChanged: false,
      isMusicPaused: true,
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
