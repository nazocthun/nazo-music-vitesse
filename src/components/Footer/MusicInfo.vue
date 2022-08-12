<template>
  <div class="music-box" flex box-border p-2 w="20%" min-w="15%">
    <div
      class="img-wrap" :class="{ 'cursor-pointer': currentMusicInfo.picUrl !== undefined }" flex justify-center
      items-center w-12 h-12 onselectstart="return false" rounded-xl @click="toggleLyric()"
    >
      <img v-if="currentMusicInfo.picUrl" :src="currentMusicInfo.picUrl" h-full rounded-xl>
      <div
        v-if="!currentMusicInfo.picUrl" flex items-center justify-center w-12 h-12 text-white bg-orange-700
        rounded-xl
      >
        <div w-10 h-10 i-ic-sharp-music-note />
      </div>
      <div
        v-if="currentMusicInfo.picUrl" fixed flex items-center justify-center w-12 h-12 text-white bg="gray-500/50"
        opacity-0 hover:opacity-100 rounded-xl
      >
        <div v-if="!showLyric" w-10 h-10 i-ic-sharp-keyboard-arrow-up title="打开音乐详情页" />
        <div v-else w-10 h-10 i-ic-sharp-keyboard-arrow-down title="关闭音乐详情页" />
      </div>
    </div>
    <div v-show="currentMusicInfo" class="music-info" w-full flex="~ col" justify-center items-center ml-3>
      <div
        v-show="currentMusicUrl" text-sm w-full block overflow-x-hidden text-ellipsis whitespace-nowrap
        :title="currentMusicInfo.name"
      >
        {{ currentMusicInfo.name }}
      </div>
      <div v-show="currentMusicUrl" mt-2 text-xs w-full inline-block overflow-x-hidden text-ellipsis whitespace-nowrap>
        <div v-for="(artist, i) in currentMusicInfo.artists" :key="i + 99" inline-block cursor-default>
          <span>{{ artist.name }}</span>
          <span v-show="currentMusicInfo.artists.length !== 1 && i !== currentMusicInfo.artists.length - 1">
            &amp;&nbsp;
          </span>
        </div>
      </div>
      <div v-show="!currentMusicUrl" text-sm w-full overflow-x-hidden text-ellipsis whitespace-nowrap cursor-default>
        还没有播放音乐哦
      </div>
    </div>
    <Teleport to="body">
      <Transition name="slide">
        <MusicLyric v-show="showLyric" :music-data="currentMusicInfo" />
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMusicInfoStore } from '@/store/MusicInfoStore'
const MUSIC_INFO_STORE = useMusicInfoStore()
const { currentMusicUrl, currentMusicInfo } = storeToRefs(MUSIC_INFO_STORE)

const showLyric = ref(false)

function toggleLyric() {
  if (currentMusicUrl.value)
    showLyric.value = !showLyric.value
}
</script>

<style lang="scss">
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}
</style>
