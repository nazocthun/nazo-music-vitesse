<template>
  <div w-160 min-w-50 h-full mx-auto my-0 p-1 box-border flex>
    <audio
      ref="audio"
      :src="currentMusicUrl"
      controls
      autoplay
      style="display:none"
      您的浏览器不支持audio标签
      @canplay="getDuration"
      @timeupdate="updateTime"
      @ended="onEnded"
    />
    <div flex-1>
      <div flex w-full h="50%" mx-auto my-0 items-center justify-evenly>
        <div cursor-pointer rounded-full hover="bg-orange-700/20" w-8 h-8>
          <div
            w-full h-full
            class="prev" i-ic-sharp-skip-previous @click="prev"
          />
        </div>
        <div v-if="isMusicPaused" cursor-pointer rounded-full hover="bg-orange-700/20" w-8 h-8>
          <div
            w-full h-full
            i-ic-sharp-play-arrow class="play" @click="changePlayControlStatus('play')"
          />
        </div>
        <div v-if="!isMusicPaused" cursor-pointer rounded-full hover="bg-orange-700/20" w-8 h-8>
          <div
            w-full h-full
            i-ic-sharp-pause class="pause" @click="changePlayControlStatus('pause')"
          />
        </div>
        <div cursor-pointer rounded-full hover="bg-orange-700/20" w-8 h-8>
          <div
            w-full h-full
            class="next" i-ic-sharp-skip-next @click="next"
          />
        </div>
      </div>
      <div flex items-center>
        <span text-xs cursor-default pr-3 w-10 text-center>{{ playControlTimeFormat(currentTime) }}</span>
        <div flex-1 mx-2 my-0 justify-center>
          <el-slider
            v-model="currentTime"
            :max="duration"
            :show-tooltip="false"
            @change="changeCurrentTime"
            @mousedown.left="isDraging = true"
            @mouseup.left="isDraging = false"
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
            @click="volume = 0"
          />
          <div
            v-if="volume <= 0.5 && volume !== 0"
            w-full h-full i-ic-sharp-volume-down
            @click="volume = 0"
          />
          <div
            v-if="!volume"
            w-full h-full i-ic-sharp-volume-off
            @click="volume=(cacheVolume==0 ? 0.7 : cacheVolume)"
          />
        </div>
        <div flex-1 mx-2 my-0>
          <el-slider
            v-model="volume"
            :max="1"
            :step="0.1"
            :show-tooltip="true"
            :format-tooltip="volumeTooltip"
            @input="changeVolume"
            @change="changeCacheVolume"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { playControlTimeFormat } from '@/utils/common'
import usePlay from '@/hooks/usePlay'
import { useMusicInfoStore } from '@/store/MusicInfoStore'
import { useMusicQueueStore } from '@/store/MusicQueueStore'
import { usePlayStore } from '@/store/PlayStore'

const props = defineProps({
  currentMusicUrl: {
    type: String,
    default: '',
  },
})

const em = defineEmits(['play', 'autoplay', 'pause', 'timeupdate', 'end', 'prev', 'next'])

const MUSIC_INFO_STORE = useMusicInfoStore()
const MUSIC_QUEUE_STORE = useMusicQueueStore()
const PLAY_STORE = usePlayStore()

const { currentMusicUrl } = storeToRefs(MUSIC_INFO_STORE)
const { musicQueue } = storeToRefs(MUSIC_QUEUE_STORE)
const { isMusicPaused, isMusicChanged, playType } = storeToRefs(PLAY_STORE)

const isDraging = ref(false)
const audio = ref()
const duration = ref()
const currentTime = ref()

// 音量控制
const volume = ref(1)
const cacheVolume = ref(1)

function changeVolume() {
  audio.value.volume = volume.value
}

function changeCacheVolume() {
  cacheVolume.value = volume.value
}

function volumeTooltip(volume: number) {
  return `${volume * 100}%`
}

watch(() => volume.value, () => {
  if (!volume.value)
    audio.value.muted = true
  else
    audio.value.muted = false
})

// 传入音乐Url更改播放按钮与播放状态
watch(() => props.currentMusicUrl, (newValue) => {
  if (newValue) { // 传入有效音乐Url
    if (playType.value === 'doubleclick' || playType.value === 'playbutton')
      em('play')
    else
      em('autoplay')
  }
  else { // 音乐队列为空时
    em('pause')
    duration.value = 0
    audio.value.currentTime = 0
    currentTime.value = 0
  }
})

// 监测音乐改变，用于监测连续播放同一首歌重置时间
watch(() => isMusicChanged.value, () => {
  // console.log('music changed')
  audio.value.currentTime = 0
  currentTime.value = 0
  em('play')
})

// 播放音乐Hook
const { play } = usePlay('queue', isMusicPaused)
function changePlayControlStatus(option: string) { // 播放按钮动作
  if (option === 'play') {
    if (props.currentMusicUrl) {
      audio.value.play()
      console.log('play')
      em('play')
    }
    else {
      if (musicQueue.value.length !== 0) {
        console.log(musicQueue.value)
        play(musicQueue.value[0], 'playbutton')
      }
      else {
        ElMessage({
          type: 'error',
          message: '队列中没有音乐',
          showClose: true,
        })
      }
    }
  }
  else {
    audio.value.pause()
    em('pause')
  }
}

// 进度条控制
function updateTime(e: any) {
  if (!(isDraging.value)) {
    currentTime.value = e.target.currentTime
    em('timeupdate', e)
  }
}

function changeCurrentTime() {
  // 存在拖动进度条歌词不随着滚动的bug
  audio.value.currentTime = currentTime.value
  isDraging.value = false
  // this.changeStatus(this.isPaused?'play':'pause')
}

function getDuration(e: any) {
  duration.value = e.target.duration
  if (isMusicPaused.value)
    audio.value.pause()
}

// 播放控制
function onEnded() {
  em('end')
}

function prev() {
  em('prev')
}

function next() {
  em('next')
}
</script>
