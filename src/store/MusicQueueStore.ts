import { defineStore } from 'pinia'

export const useMusicQueueStore = defineStore({
  id: 'musicQueueStore',
  state: () => {
    return {
      nowIndex: 0,
      musicQueue: [] as Music[],
      shuffleMusicQueue: [] as Music[],
      musicQueueStyle: '',
      deleteToNext: false,
      queuePlayStyle: 'sequence',
    }
  },
  actions: {
    changQueueStyleTo(style: string) {
      this.musicQueueStyle = style
    },
    changeNowIndexTo(index: number) {
      this.nowIndex = index
    },
    addToQueueWith(music: Music) {
      this.musicQueue.push(music)
    },
    deleteMusicBy(id: number) {
      const queue = this.musicQueue
      for (let i = 0; i < queue.length; i++) {
        if (queue[i].id === id)
          queue.splice(i, 1)
      }
    },
    toggleDeleteToNext() {
      this.deleteToNext = !this.deleteToNext
    },
    toggleQueuePlayStyle() {
      const styles = ['sequence', 'loop', 'single-loop', 'shuffle']
      const position = styles.indexOf(this.queuePlayStyle)
      this.queuePlayStyle = styles[(position + 1) % styles.length]
    },
  },
  getters: {
  },
})
