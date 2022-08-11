<template>
  <div v-loading="loading">
    <div v-if="hasSong()">
      <MusicTable
        :data="musicData" :loading="tableLoading" :pic="false" :album="true" :more="false" :show-more="false"
        :page="page" :page-size="pageSize"
      />
      <div items-center justify-center flex py-5>
        <el-pagination
          :current-page="page" background hide-on-single-page layout="prev, pager, next" :total="songCount"
          :page-size="pageSize" @current-change="songResultPagination"
        />
      </div>
    </div>
    <div v-else-if="loading === false" text-center mt-5>
      很抱歉，未能找到与<span text-sky-700>「{{ props.searchWords }}」</span>相关的任何单曲。
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSearchMusicResult } from '@/api/searchAPI/search'
const props = defineProps({
  searchWords: {
    default: () => {
      return ''
    },
    required: true,
  },
})

const em = defineEmits(['scrollTop'])

const loading = ref<boolean>(true)
const tableLoading = ref<boolean>(true)
const offset = ref<number>(0)
const page = ref<number>(1)
const pageSize = 50

const musicData = ref<Music[]>([] as Music[])

const songCount = ref<number>(0)
defineExpose({ songCount })

const hasSong = () => {
  return songCount.value !== 0
}

function initSongResult() {
  loading.value = true
  offset.value = 0
  getSearchMusicResult({
    keywords: props.searchWords,
    type: 1,
    limit: pageSize,
    offset: 0,
  }).then((res) => {
    songCount.value = (res as MusicSearchResult).songCount
    musicData.value = (res as MusicSearchResult).songs ?? []
    loading.value = false
    tableLoading.value = false
  })
}

function songResultPagination(val: number) {
  tableLoading.value = true
  page.value = val
  getSearchMusicResult({
    keywords: props.searchWords,
    type: 1,
    limit: pageSize,
    offset: pageSize * (val - 1),
  }).then((res) => {
    musicData.value = (res as MusicSearchResult).songs ?? []
    tableLoading.value = false
  }).then(() => {
    em('scrollTop')
  })
}

onMounted(() => {
  if (props.searchWords !== '')
    initSongResult()
})

watch(() => props.searchWords, () => {
  page.value = 1
  initSongResult()
})
</script>

<style>

</style>
