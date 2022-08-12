<template>
  <div w-180 min-w-50 h-full mx-auto my-0 p-1 box-border flex>
    <audio ref="audio" autoplay />
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
        <span text-xs cursor-default pr-3 w-10 text-center>{{ playControlTimeFormat(audioTime) }}</span>
        <div flex-1 mx-2 my-0 justify-center>
          <el-slider
            v-model="audioTime"
            :max="duration"
            :show-tooltip="false"
            :disabled="duration === 0"
            @input="updateDragingTime"
            @change="updateTime"
          />
        </div>
        <span text-xs cursor-default pl-3 w-10 text-center>{{ playControlTimeFormat(duration) }}</span>
      </div>
    </div>
    <div w="25%" min-w-150px ml-3>
      <div h="50%" w-full />
      <div flex items-center>
        <div cursor-pointer w-5 h-5 mr-6>
          <div
            v-if="playMode === 'sequence'"
            w-full h-full i-mdi-shuffle-disabled
            @click="toggleMode"
          />
          <div
            v-if="playMode === 'shuffle'"
            w-full h-full i-mdi-shuffle
            @click="toggleMode"
          />
          <div
            v-if="playMode === 'loop'"
            w-full h-full i-mdi-repeat-once
            @click="toggleMode"
          />
        </div>
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
import _ from 'lodash'
import { playControlTimeFormat } from '@/utils/common'
import { useMusicInfoStore } from '@/store/MusicInfoStore'
import { useMusicQueueStore } from '@/store/MusicQueueStore'
import { usePlayStore } from '@/store/PlayStore'
import useMusicQueue from '@/hooks/useMusicQueue'
import usePlay from '@/hooks/usePlay'

const MUSIC_INFO_STORE = useMusicInfoStore()
const MUSIC_QUEUE_STORE = useMusicQueueStore()
const PLAY_STORE = usePlayStore()

const { currentMusicUrl, currentMusicTime } = storeToRefs(MUSIC_INFO_STORE)
const { musicQueue, nowIndex } = storeToRefs(MUSIC_QUEUE_STORE)
const { isMusicChanged, isPlaying, playMode } = storeToRefs(PLAY_STORE)

const { musicChanged } = usePlayStore()
const { prevQueue, nextQueue } = useMusicQueue()

const audio = ref()
const { playing, currentTime, duration, volume, ended } = useMediaControls(audio, {
  src: currentMusicUrl,
})

const audioTime = ref()

// 播放控制
const { getMusicInfo } = usePlay()
defineExpose({ play, stop })
function play() {
  if (currentMusicUrl.value === '') {
    if (musicQueue.value.length !== 0) {
      getMusicInfo(musicQueue.value[nowIndex.value], 'queue')
    }
    else {
      ElMessage({
        message: '队列中没有音乐',
        type: 'warning',
        showClose: true,
      })
    }
  }
  else {
    useToggle(playing)()
  }
}

function stop() {
  playing.value = false
  audioTime.value = 0
  currentTime.value = 0
  currentMusicUrl.value = ''
  setTimeout(() => {
    duration.value = 0
  }, 50)
}

function prev() {
  if (prevQueue())
    getMusicInfo(musicQueue.value[nowIndex.value], 'queue')
}

function next() {
  if (playMode.value === 'shuffle') {
    MUSIC_QUEUE_STORE.$patch((state) => {
      if (state.shuffleMusicIndex.length === 0) {
        state.shuffleMusicIndex = [...Array(state.musicQueue.length).keys()]
        state.shuffleMusicIndex.splice(state.nowIndex, 1)
        state.shuffleMusicIndex = _.shuffle(state.shuffleMusicIndex)
      }
      state.nowIndex = state.shuffleMusicIndex.shift() as number
      musicChanged()
    })
  }
  else {
    if (nextQueue())
      getMusicInfo(musicQueue.value[nowIndex.value], 'queue')
    else
      stop()
  }
}

whenever(ended, () => {
  if (playMode.value === 'loop') {
    musicChanged()
    useToggle(playing)()
  }
  else {
    next()
  }
  useToggle(ended)()
})

watch(playing, () => {
  PLAY_STORE.$patch((state) => {
    state.isPlaying = playing.value
  })
})

watch(isPlaying, () => {
  playing.value = isPlaying.value
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

// 播放模式
function toggleMode() {
  const modes = ['sequence', 'shuffle', 'loop']
  PLAY_STORE.$patch((state) => {
    state.playMode = modes[(modes.indexOf(state.playMode) + 1) % 3]
  })
}
// 音乐改变时重置时间 改变队列当前播放音乐
watch(isMusicChanged, () => {
  currentTime.value = 0
})

// 更新时间 实现拖动进度条时 音乐继续播放 松手才重新定位
const isDraging = ref(false)

watch(currentTime, () => {
  if (isDraging.value)
    return
  audioTime.value = currentTime.value
  currentMusicTime.value = currentTime.value
})

function updateTime() {
  currentTime.value = audioTime.value
  isDraging.value = false
}

function updateDragingTime() {
  isDraging.value = true
}
</script>
