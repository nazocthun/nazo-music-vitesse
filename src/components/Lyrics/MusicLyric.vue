<template>
  <div fixed top-0 w-full h="[calc(100%-64px)]" bg-white>
    <div flex w-full h-full aspect-square absolute overflow-hidden bg-black>
      <img w-full blur-50 opacity-80 scale-150 :src="musicInfo.picUrl" draggable="false" onselectstart="return false">
    </div>
    <div w-full h-full flex items-center justify-center>
      <div w="50%" flex items-center justify-center>
        <div w="50%" aspect-square z-100>
          <CoverLazy :src="musicData.picUrl" />
        </div>
      </div>
      <div w="50%" h-full flex-col items-center justify-center>
        <div v-if="musicInfo.id" h="15%" />
        <el-scrollbar ref="scrollbar" w="75%" h="70%" @scroll="scroll">
          <ul>
            <li
              v-for="(lyric, index) in lyricList" :id="String(index)" :key="index" z-100 text-white
              drop-shadow="[0_0_4px_rgba(0,0,0,1)]" text-xl
              :class="{ 'active-lyric': liveLyricIndex === index, 'scrolling': isScrolling, 'idle': !isScrolling && (liveLyricIndex !== index) }"
              list-none p-0 opacity-50 my-2
            >
              {{ lyric.content }}
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getLyric } from '@/api/musicAPI/getLyric'
import { useMusicInfoStore } from '@/store/MusicInfoStore'

const props = defineProps({
  musicData: {
    default() {
      return {} as Music
    },
    required: true,
  },
})

const MUSIC_INFO_STORE = useMusicInfoStore()
const { currentMusicTime } = storeToRefs(MUSIC_INFO_STORE)

const musicInfo = ref<Music>({} as Music)
const lyricList = ref<Lyric[]>([])
const liveLyricIndex = ref<number>(0)
const scrollbar = ref()

const isScrolling = ref(false)
const currentScrollTop = ref(0)

const { idle } = useIdle(5 * 1000)

function scroll({ scrollTop }) {
  currentScrollTop.value = scrollTop
}

const { pause, resume } = watchPausable(
  currentScrollTop,
  () => {
    isScrolling.value = true
  },
)

async function liveLyric(time: number) {
  let lastLineTime = 0
  for (let i = 0; i < lyricList.value.length; i++) {
    if (time > lastLineTime && time < lyricList.value[i].time) {
      liveLyricIndex.value = i - 1
      const _p: HTMLElement = document.querySelector('.active-lyric')!
      const _pOffsetTop = _p!.offsetTop
      if (!isScrolling.value || idle.value) {
        pause()
        await nextTick()
        currentScrollTop.value = _pOffsetTop - _p.offsetHeight
        scrollbar.value.setScrollTop(currentScrollTop.value)
        isScrolling.value = false
        await nextTick()
        resume()
      }
      return
    }
    lastLineTime = lyricList.value[i].time
  }
}

onMounted(() => {
  musicInfo.value = props.musicData
})

watchThrottled(
  currentMusicTime,
  (time) => { liveLyric(time) },
  { throttle: 200 },
)

watch(() => props.musicData, () => {
  musicInfo.value = props.musicData
  if (musicInfo.value.id) {
    getLyric({ id: musicInfo.value.id }).then((res) => {
      lyricList.value = res
    })
    scrollbar.value.setScrollTop(0)
  }
})
</script>

<style scoped>
.active-lyric {
  @apply font-bold text-2xl opacity-100 blur-0 !important;
}
.scrolling {
  @apply blur-0 !important;
}
.idle {
  @apply blur-1 !important;
}
</style>
