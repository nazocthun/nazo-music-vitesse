<template>
  <div ref="bottomZone" flex items-center>
    <MusicInfo />
    <PlayControl />
    <div w="10%">
      <el-tooltip content="播放队列" placement="top" effect="light">
        <div
          ref="queueButton"
          :class="{
            'queue-icon queue-delete-before animate-[deleteAnimation_0.3s_reverse]':musicQueueStyle=='delete',
            'queue-icon queue-add-before animate-[addAnimation_0.3s_reverse]':musicQueueStyle=='add',
            'queue-icon':musicQueueStyle=='normal'
          }"
          flex justify-start items-center cursor-pointer float-left
          @click="toggleQueue()"
        >
          <span w-8 h-8 i-ic-sharp-queue-music />
          <span w-8>{{ musicQueue.length }}</span>
        </div>
      </el-tooltip>
    </div>
    <transition name="fade">
      <MusicQueue v-show="showQueue" ref="queue" @playing="showIcon" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMusicQueueStore } from '@/store/MusicQueueStore'

const MUSIC_QUEUE_STORE = useMusicQueueStore()

const { musicQueue, musicQueueStyle } = storeToRefs(MUSIC_QUEUE_STORE)

const showQueue = ref(false)
const bottomZone = ref()
const queue = ref(null)

const toggleQueue = useToggle(showQueue)

onClickOutside(queue, () => {
  if (showQueue.value)
    toggleQueue()
}, { ignore: [bottomZone] })

</script>

<style scoped>
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
.queue-icon {
  @apply mr-24 cursor-pointer
}

@keyframes addAnimation {
  to {
    color: rgb(194, 65, 12);
    transform: scale(1.2);
  }
}

@keyframes deleteAnimation {
  to {
    color: rgb(34, 211, 238);
    transform: scale(1.2);
  }
}

.queue-icon-before {
  @apply before:absolute before:-top-2 before:-left-5 before:font-bold before:scale-75
}

.queue-add-before {
  @apply before:content-['+1'] queue-icon-before
}
.queue-delete-before {
  @apply before:content-['-1'] queue-icon-before
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
