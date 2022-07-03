<template>
  <el-scrollbar ref="scrollBar" style="height:100%" @scroll="scroll">
    <div class="whole-page" my-0 mx-auto p-5>
      <CoverView
        :data="songListsData"
        :more="more"
        :show-more="true"
        @load-more="loadMore"
        @play="playSongListById"
        @to="toSongList"
      />
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { getSelfMadeSongList } from '@/api/getSongListInfo'
import useSongList from '@/hooks/useSongList'

const { playSongListById } = useSongList()
const router = useRouter()
const loading = ref(true)
const more = ref(true)
const songListsData = ref<SongList[]>([] as SongList[])

function toSongList(id: number) {
  router.push(`/list/${id}`)
}
const params = reactive({
  limit: 20,
  offset: 0,
  realIP: '116.25.146.177',
})

function init() {
  loading.value = true
  getSelfMadeSongList(params).then((res) => {
    songListsData.value = res.songList
    params.offset += 20
    more.value = res.more
  }).then(() => {
    loading.value = false
  })
}

async function loadMore() {
  await getSelfMadeSongList(params).then((res) => {
    if (res.songList.length === 0) return
    for (const item of res.songList)
      songListsData.value.push(item)
    params.offset += 20
    more.value = res.more
  })
}

// keep-alive记住滚动条位置
const currentScrollTop = ref(0)
function scroll({ scrollTop }: { scrollTop: number }) {
  currentScrollTop.value = scrollTop
}
const scrollBar = ref()
onActivated(() => scrollBar.value.setScrollTop(currentScrollTop.value))
</script>

<style>
.whole-page {
  max-width: min(calc(100vw - 251px), 1300px);
}
</style>

<route>
{
  name: "customlists",
  meta: {
    keepAlive: true,
  }
}
</route>
