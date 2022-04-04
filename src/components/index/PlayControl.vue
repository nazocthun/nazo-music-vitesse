<template>
  <div w-160 min-w-50 h-full mx-auto my-0 p-1 box-border flex>
    <audio ref="audio" autoplay />
    <button @click="log">LOG</button>
    <div flex-1>
      <div flex w-full h="50%" mx-auto my-0 items-center justify-evenly>
        <div cursor-pointer rounded-full hover="bg-orange-700/20" w-8 h-8 @click="prev">
          <div
            w-full h-full
            class="prev" i-ic-sharp-skip-previous
          />
        </div>
        <div cursor-pointer rounded-full hover="bg-orange-700/20" w-8 h-8 @click="play">
          <div
            v-if="!playing"
            w-full h-full
            i-ic-sharp-play-arrow class="play"
          />
          <div
            v-if="playing"
            w-full h-full
            i-ic-sharp-pause class="pause"
          />
        </div>
        <div cursor-pointer rounded-full hover="bg-orange-700/20" w-8 h-8 @click="next">
          <div
            w-full h-full
            class="next" i-ic-sharp-skip-next
          />
        </div>
      </div>
      <div flex items-center>
        <span text-xs cursor-default pr-3 w-10 text-center>{{ playControlTimeFormat(currentTime) }}</span>
        <div flex-1 mx-2 my-0 justify-center>
          <el-slider
            v-model="audioTime"
            :max="duration"
            :show-tooltip="false"
            @change="updateTime"
          />
        </div>
        <span text-xs cursor-default pl-3 w-10 text-center>{{ playControlTimeFormat(duration) }}</span>
      </div>
    </div>
    <div w="25%" min-w-150px ml-12>
      <div h="50%" />
      <div flex items-center>
        <div cursor-pointer w-6 h-6 mr-1>
          <div
            v-if="volume > 0.5"
            w-full h-full i-ic-sharp-volume-up
            @click="mute"
          />
          <div
            v-if="volume <= 0.5 && volume !== 0"
            w-full h-full i-ic-sharp-volume-down
            @click="mute"
          />
          <div
            v-if="!volume"
            w-full h-full i-ic-sharp-volume-off
            @click="unMute"
          />
        </div>
        <div flex-1 mx-2 my-0>
          <el-slider
            v-model="volume"
            :max="1"
            :step="0.1"
            :show-tooltip="true"
            :format-tooltip="volumeTooltip"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { playControlTimeFormat } from '@/utils/common'
import { useMusicInfoStore } from '@/store/MusicInfoStore'
import { useMusicQueueStore } from '@/store/MusicQueueStore'
import { usePlayStore } from '@/store/PlayStore'
import useMusicQueue from '@/hooks/useMusicQueue'
import usePlay from '@/hooks/usePlay'

const MUSIC_INFO_STORE = useMusicInfoStore()
const MUSIC_QUEUE_STORE = useMusicQueueStore()
const PLAY_STORE = usePlayStore()

const { currentMusicUrl } = storeToRefs(MUSIC_INFO_STORE)
const { musicQueue, nowIndex } = storeToRefs(MUSIC_QUEUE_STORE)
const { isMusicChanged } = storeToRefs(PLAY_STORE)

const { prevQueue, nextQueue } = useMusicQueue()

const audio = ref()
const { playing, currentTime, duration, volume, ended } = useMediaControls(audio, {
  src: currentMusicUrl,
})

const audioTime = ref()

function log() {
  console.log(playing.value, currentTime.value, duration.value, currentMusicUrl.value)
}

// 播放控制
const { getMusicInfo } = usePlay()
function play() {
  useToggle(playing)()
}

function stop() {
  playing.value = false
  currentTime.value = 0
  duration.value = 0
  currentMusicUrl.value = ''
}

function prev() {
  if (prevQueue())
    getMusicInfo(musicQueue.value[nowIndex.value], 'queue')
}

function next() {
  if (nextQueue()) {
    getMusicInfo(musicQueue.value[nowIndex.value], 'queue')
    return
  }
  stop()
}

whenever(ended, () => {
  next()
  useToggle(ended)()
})

// 音量处理
const cacheVolume = ref(0.7)

function mute() {
  cacheVolume.value = volume.value
  volume.value = 0
}

function unMute() {
  volume.value = cacheVolume.value
  cacheVolume.value = 0.7
}

function volumeTooltip(volume: number) {
  return `${volume * 100}%`
}

// 音乐改变时重置时间 改变队列当前播放音乐
watch(isMusicChanged, () => {
  currentTime.value = 0
})

// 更新时间 实现拖动进度条时 音乐继续播放 松手才重新定位
watch(currentTime, () => {
  audioTime.value = currentTime.value
})

function updateTime() {
  currentTime.value = audioTime.value
}
</script>
