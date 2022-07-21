import { acceptHMRUpdate, defineStore } from 'pinia'

export const useCookieStore = defineStore('cookieStore', () => {
  const cookie = ref('')
  function getCookie() {
    return cookie.value
  }
  return {
    cookie,
    getCookie,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCookieStore, import.meta.hot))
