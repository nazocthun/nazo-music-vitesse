<template>
  <el-scrollbar ref="scrollBar" style="height:100%" @scroll="scroll">
    <div class="whole-page" mx-auto p-5>
      <BannerView w="1080px" p-3 mx-auto />
      <div m-3 text="xl" font-bold>
        推荐歌单
      </div>
      <CoverView
        :data="personalizedSongList" :more="false" :show-more="false" @play="playSongListById"
        @to="toSongList"
      />
      <div m-3 text="xl" font-bold>
        推荐MV
      </div>
      <CoverView
        :data="personalizedMV" :more="false" :show-more="false" :col="2" :show-time="false" @play="toMV"
        @to="toMV"
      />
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { getPersonalizedMV, getPersonalizedSongList } from '@/api/indexAPI/getPersonalized'
import useSongList from '@/hooks/useSongList'

const router = useRouter()
const personalizedSongList = ref<SongList[]>([])
const personalizedMV = ref<MV[]>([])
const { playSongListById } = useSongList()

// keep-alive记住滚动条位置
const currentScrollTop = ref(0)
const scrollDebouncedFn = useDebounceFn((scrollTop) => {
  currentScrollTop.value = scrollTop
}, 500, { maxWait: 2000 })

const scroll = ({ scrollTop }: { scrollTop: number }) => {
  scrollDebouncedFn(scrollTop)
}

const scrollBar = ref()
onActivated(() => scrollBar.value.setScrollTop(currentScrollTop.value))

// init
onMounted(() => init())
function init() {
  getPersonalizedSongList({ limit: 10 }).then((res) => {
    personalizedSongList.value = res
  })
  getPersonalizedMV().then((res) => {
    console.log(res)
    personalizedMV.value = res
  })
}

function toMV(id: number) {
  router.push(`/mv/${id}`)
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
