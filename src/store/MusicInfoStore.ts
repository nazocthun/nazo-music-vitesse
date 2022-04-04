import { defineStore } from 'pinia'
import type { StateTree } from 'pinia'

export const useMusicInfoStore = defineStore({
  id: 'musicInfoStore',
  state: () => {
    return {
      currentMusicUrl: '',
      currentMusicInfo: {} as Music,
      currentTime: 0,
    }
  },
  actions: {
  },
  getters: {
    getCurrentMusicUrl: (state: StateTree) => state.currentMusicUrl,
    getCurrentMusicInfo: (state: StateTree) => state.currentMusicInfo,
    getCurrentTime: (state: StateTree) => state.currentTime,
  },
})
