<template>
  <div v-loading="loading">
    <div v-if="hasAlbum()">
      <ul p-0>
        <li
          v-for="(album, index) in albumData" :key="index" list-none even-bg-gray-1 p-2 hover:bg-slate-200
          cursor-pointer
        >
          <div flex items-center @click="toAlbum(album.id)">
            <div w="60%" flex items-center>
              <div w-16 h-16>
                <CoverLazy :src="album.picUrl" />
              </div>
              <div ml-5 text-gray-600 hover-text-black>
                {{ album.name }}
              </div>
            </div>
            <div text-sky-600 hover-underline-offset-2 hover-underline @click.stop="toArtist(album.artist.id)">
              {{ album.artist?.name }}
            </div>
          </div>
        </li>
      </ul>
      <div items-center justify-center flex py-5>
        <el-pagination
          :current-page="page" background hide-on-single-page layout="prev, pager, next"
          :total="albumCount" :page-size="pageSize" @current-change="songResultPagination"
        />
      </div>
    </div>
    <div v-else-if="loading === false" text-center mt-5>
      很抱歉，未能找到与<span text-sky-700>「{{ props.searchWords }}」</span>相关的任何专辑。
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSearchAlbumResult } from '@/api/searchAPI/search'

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
const offset = ref<number>(0)
const page = ref<number>(1)
const pageSize = 20

const albumData = ref([] as AlbumSimple[])

const albumCount = ref<number>(0)
defineExpose({ albumCount })

const hasAlbum = () => {
  return albumCount.value !== 0
}

function initAlbumResult() {
  loading.value = true
  offset.value = 0
  getSearchAlbumResult({
    keywords: props.searchWords,
    type: 10,
    limit: pageSize,
    offset: 0,
  }).then((res) => {
    albumCount.value = (res as AlbumSearchResult).albumCount
    albumData.value = (res as AlbumSearchResult).albums ?? []
    loading.value = false
  })
}

function songResultPagination(val: number) {
  loading.value = true
  page.value = val
  getSearchAlbumResult({
    keywords: props.searchWords,
    type: 10,
    limit: pageSize,
    offset: pageSize * (val - 1),
  }).then((res) => {
    albumData.value = (res as AlbumSearchResult).albums ?? []
    loading.value = false
  }).then(() => {
    em('scrollTop')
  })
}

const router = useRouter()
function toAlbum(id: number) {
  router.push(`/album/${id}`)
}
function toArtist(id: number) {
  router.push(`/artist/${id}`)
}

onMounted(() => {
  if (props.searchWords !== '')
    initAlbumResult()
})

watch(() => props.searchWords, () => {
  page.value = 1
  initAlbumResult()
})
</script>

<style>

</style>
