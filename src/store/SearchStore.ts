import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSearchStore = defineStore('searchStore', () => {
  const searchHistory = ref<string[]>([])
  return {
    searchHistory,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
