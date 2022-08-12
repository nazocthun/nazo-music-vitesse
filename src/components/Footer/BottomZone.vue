<template>
  <div ref="bottomZone" flex items-center>
    <MusicInfo />
    <PlayControl ref="playControl" />
    <div w="10%">
      <el-tooltip content="播放队列" placement="top" effect="light">
        <div ref="queueButton" :class="{
          'queue-delete-before': musicQueueStyle === 'delete',
          'queue-add-before': musicQueueStyle === 'add',
        }" mr-24 cursor-pointer flex relative justify-start items-center float-left @click="toggleQueue()">
          <span w-8 h-8 i-ic-sharp-queue-music />
          <span w-8>{{ musicQueue.length }}</span>
        </div>
      </el-tooltip>
    </div>
    <Teleport to="body">
      <transition name="fade">
        <MusicQueue v-show="showQueue" ref="queue" @clear="stop" />
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMusicQueueStore } from '@/store/MusicQueueStore'
const MUSIC_QUEUE_STORE = useMusicQueueStore()

const { musicQueue, musicQueueStyle } = storeToRefs(MUSIC_QUEUE_STORE)

const showQueue = ref(false)
const bottomZone = ref()
const playControl = ref()
const queue = ref(null)

const toggleQueue = useToggle(showQueue)

onClickOutside(queue, () => {
  if (showQueue.value)
    toggleQueue()
}, { ignore: [bottomZone] })

defineExpose({ spaceDown })
function spaceDown() {
  playControl.value.play()
}

function stop() {
  playControl.value.stop()
}
</script>

<style>
.footer audio {
  width: 100%;
  outline: none;
}

.music-box .img-wrap::before{
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0,.3);
  color: #fff;
  border-radius: 5px;
  display: none;
}

.music-box .img-wrap:hover::before{
  display: flex;
}

@keyframes addAnimation {
  from {
    transform: scale(1);
  }
  to {
    color: rgb(194, 65, 12);
    transform: scale(1.2);
  }
}

@keyframes deleteAnimation {
  from {
    transform: scale(1);
  }
  to {
    color: rgb(34, 211, 238);
    transform: scale(1.2);
  }
}

.queue-add-before {
  @apply before:content-[+1];
  @apply before:absolute before:-top-2 before:-left-5 before:font-bold before:scale-75;
  @apply before:animate-[addAnimation_0.5s_reverse];
}
.queue-delete-before {
  @apply before:content-[-1];
  @apply before:absolute before:-top-2 before:-left-5 before:font-bold before:scale-75;
  @apply before:animate-[deleteAnimation_0.5s_reverse];
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease-in-out;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
