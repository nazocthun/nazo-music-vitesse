<template>
  <el-scrollbar ref="scrollBar" style="height:100%" @scroll="scroll">
    <div class="whole-page" mx-auto p-5>
      <BannerView w="1080px" p-3 mx-auto />
      <div m-3 text="xl" font-bold>
        推荐歌单
      </div>
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
import { getPersonalizedSongList } from '@/api/getPersonalized'
import useSongList from '@/hooks/useSongList'

const router = useRouter()
const personlizedSongList = ref<SongList[]>([])
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
    personlizedSongList.value = res
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
