<template>
  <el-container direction="vertical">
    <NavBar class="bg-slate-200" relative items-center />
    <MainPage class="mainpage fixed top-16 bottom-16 w-full" />
    <BottomZone ref="bz" class="bg-slate-200" fixed bottom-0 h-16 w-full />
  </el-container>
  <!-- <Footer /> -->
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { loginAnonimous } from './api/login'
import { useMusicInfoStore } from './store/MusicInfoStore'
import { useMusicQueueStore } from './store/MusicQueueStore'

const MUSIC_QUEUE_STORE = useMusicQueueStore()
const MUSIC_INFO_STORE = useMusicInfoStore()
const { nowIndex, musicQueue, musicHistory } = storeToRefs(MUSIC_QUEUE_STORE)

MUSIC_QUEUE_STORE.$subscribe((state) => {
  localStorage.setItem('nazoMusicQueue', JSON.stringify(musicQueue.value))
  localStorage.setItem('nazoMusicHistory', JSON.stringify(musicHistory.value))
  localStorage.setItem('nazoMusicIndex', JSON.stringify(nowIndex.value))
})

MUSIC_INFO_STORE.$subscribe((state) => {
  localStorage.setItem('nazoMusicPlaying', JSON.stringify(state))
})

const bz = ref()

onKeyStroke([' ', 'VK_SPACE', 'kVK_SPACE'], (e: KeyboardEvent) => {
  const hotsearch = document.getElementById('hotsearch')
  const suggest = document.getElementById('suggestion')
  if (!hotsearch && !suggest) {
    bz.value.spaceDown()
    e.preventDefault()
  }
})

function checkLoginStatus() {
  const cookie = localStorage.getItem('cookie')
  if (!cookie) {
    loginAnonimous().then((res) => {
      localStorage.setItem('cookie', res)
    })
  }
}

onMounted(() => {
  checkLoginStatus()
  const storedMusicQueue = localStorage.getItem('nazoMusicQueue')
  const storedMusicHistory = localStorage.getItem('nazoMusicHistory')
  if (storedMusicQueue)
    musicQueue.value = JSON.parse(storedMusicQueue)
  if (storedMusicHistory)
    musicHistory.value = JSON.parse(storedMusicHistory)
})
</script>

<style>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

html, body{
  margin:0;
  height:100%;
}
.mainpage {
  height: calc(100vh - 128px);
}

.whole-page {
  max-width: min(calc(100vw - 251px), 1300px);
  min-width: 1104px;
}
</style>
