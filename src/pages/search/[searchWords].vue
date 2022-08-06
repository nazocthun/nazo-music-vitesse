<template>
  <el-scrollbar ref="scrollBar" style="height:100%" @scroll="scroll">
    <div class="whole-page" mx-auto p-5 pb-0>
      <div class="tab-chooser" absolute z-100 bg-white h-30 translate-y--5 w-full right-auto>
        <div id="search-label" h-8 ml-5 pt-5>
          <span font-500 text-2xl>{{ searchWords }}</span>
          <span text-sm text-gray-500> 共找到{{ songCount }}个结果</span>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="单曲" name="1" />
          <el-tab-pane label="歌手" name="10" />
          <el-tab-pane label="专辑" name="100" />
        </el-tabs>
      </div>
      <div v-if="activeName === '1'" relative top-24>
        <MusicTable
          :data=" musicData" :loading="loading" :pic="false" :album="true" :more="false" :show-more="false"
          :page="page" :page-size="pageSize"
        />
        <div items-center justify-center flex py-5>
          <el-pagination
            background hide-on-single-page layout="prev, pager, next" :total="songCount"
            :page-size="pageSize" @current-change="songResultPagination"
          />
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { getSearchResult } from '@/api/searchAPI/search'

const props = defineProps<{ searchWords: string }>()
const searchWords = ref<string>('')
const loading = ref<boolean>(true)

const scrollBar = ref()

function scrollToTop() {
  scrollBar.value.setScrollTop(0)
}

const type = ref<number>(1)
const musicData = ref<Music[]>([])
const songCount = ref<number>(0)
const page = ref<number>(1)
const pageSize = 50
const offset = ref<number>(0)

const activeName = ref('1')

function handleClick() {
  console.log(activeName.value)
  switch (activeName.value) {
    case '1':
      type.value = 1
      initSongResult()
      break
    case '10':
      type.value = 10
      break
    case '100':
      type.value = 100
      break
  }
}

async function songResultPagination(val: number) {
  loading.value = true
  page.value = val
  await getSearchResult({
    keywords: searchWords.value,
    type: type.value,
    limit: pageSize,
    offset: pageSize * (val - 1),
  }).then((res) => {
    musicData.value = (res as MusicSearchResult).songs
    loading.value = false
  }).then(() => {
    scrollToTop()
  })
}

async function initSongResult() {
  loading.value = true
  offset.value = 0
  await getSearchResult({
    keywords: searchWords.value,
    type: type.value,
    limit: pageSize,
    offset: 0,
  }).then((res) => {
    songCount.value = (res as MusicSearchResult).songCount
    musicData.value = (res as MusicSearchResult).songs
    loading.value = false
  })
}

onMounted(() => {
  searchWords.value = props.searchWords
  initSongResult()
})

watch(() => props.searchWords, () => {
  searchWords.value = props.searchWords
  activeName.value = '1'
  initSongResult()
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
