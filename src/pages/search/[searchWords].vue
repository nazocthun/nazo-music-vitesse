<template>
  <el-scrollbar ref="scrollBar" style="height:100%" @scroll="scroll">
    <div class="whole-page" mx-auto p-5 pb-0>
      <div class="tab-chooser" absolute z-100 bg-white h-30 translate-y--5 w-full right-auto>
        <div id="search-label" h-8 ml-3 pt-5>
          <span font-500 text-2xl>{{ searchWords }}</span>
          <span text-sm text-gray-500> 共找到{{ searchCount }}个结果</span>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="单曲" name="music" />
          <el-tab-pane label="专辑" name="album" />
          <el-tab-pane label="歌手" name="artist" />
        </el-tabs>
      </div>
      <KeepAlive>
        <component
          :is="searchPane" :ref="activeName" relative top-24 :search-words="searchWords"
          @scroll-top="scrollToTop"
        />
      </KeepAlive>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import SearchMusic from '@/components/Search/SearchMusic.vue'
import SearchAlbum from '@/components/Search/SearchAlbum.vue'

const props = defineProps({
  searchWords: {
    default: () => {
      return ''
    },
    required: true,
  },
})
const searchWords = ref<string>('')

const activeName = ref('music')
const searchPane = ref<any>(markRaw(SearchMusic))
const music = ref()
const album = ref()
const artist = ref()

const searchCount = computed(() => {
  if (music.value)
    return music.value.songCount
  else if (album.value)
    return album.value.albumCount
  else if (artist.value)
    return artist.value.artistCount
  else
    return 0
})

const scrollBar = ref()
function scrollToTop() {
  scrollBar.value.setScrollTop(0)
}

function handleClick() {
  console.log(activeName.value)
  switch (activeName.value) {
    case 'music':
      searchPane.value = markRaw(SearchMusic)
      break
    case 'album':
      searchPane.value = markRaw(SearchAlbum)
      break
    case 'artist':
      break
  }
}

onMounted(() => {
  searchWords.value = props.searchWords
})

watch(() => props.searchWords, () => {
  searchWords.value = props.searchWords
  activeName.value = 'music'
  searchPane.value = markRaw(SearchMusic)
})

// keep-alive记住滚动条位置
const currentScrollTop = ref(0)
const scrollDebouncedFn = useDebounceFn((scrollTop) => {
  currentScrollTop.value = scrollTop
}, 500, { maxWait: 2000 })

const scroll = ({ scrollTop }: { scrollTop: number }) => {
  scrollDebouncedFn(scrollTop)
}

onActivated(() => scrollBar.value.setScrollTop(currentScrollTop.value))
</script>

<style>
.tab-chooser {
  max-width: min(calc(100vw - 251px), 1300px);
  min-width: 1104px;
}
</style>
