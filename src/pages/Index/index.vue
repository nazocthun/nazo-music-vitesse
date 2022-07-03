<template>
  <el-scrollbar ref="scrollBar" style="height:100%" @scroll="scroll">
    <div class="whole-page" mx-auto p-5>
      <BannerView m-3 :banners="banners" />
      <div m-3 text="xl" font-bold>推荐歌单</div>
      <CoverView
        :data="personlizedSongList"
        :more="false"
        :show-more="false"
        @play="playSongListById"
        @to="toSongList"
      />
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { getBanner } from '@/api/getBanner'
import { getPersonalizedSongList } from '@/api/getPersonalized'
import useSongList from '@/hooks/useSongList'

const router = useRouter()
const banners = ref<Banner[]>([])
const personlizedSongList = ref<SongList[]>([])
const { playSongListById } = useSongList()

// keep-alive记住滚动条位置
const currentScrollTop = ref(0)
function scroll({ scrollTop }: { scrollTop: number }) {
  currentScrollTop.value = scrollTop
}
const scrollBar = ref()
onActivated(() => scrollBar.value.setScrollTop(currentScrollTop.value))

onMounted(() => init())
function init() {
  getBanner({ type: 0 }).then((res) => {
    banners.value = res
  })
  getPersonalizedSongList({ limit: 10 }).then((res) => {
    personlizedSongList.value = res
    console.log(personlizedSongList.value)
  })
}

function toSongList(id: number) {
  router.push(`/list/${id}`)
}
</script>

<style>

</style>

<route>
{
  name: "discover",
  meta: {
    keepAlive: true,
  }
}
</route>
