<template>
  <el-scrollbar ref="scrollBar" style="height:100%" @scroll="scroll">
    <div class="whole-page" my-0 mx-auto p-5>
      <el-tabs v-model="activeName" w-full @tab-click="handleClick">
        <el-tab-pane label="全部" name="全部" />
        <el-tab-pane v-for="(tag, index) in tags" :key="index" :label="tag.toString()" :name="tag.toString()" />
      </el-tabs>
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
import { getSelectedSongList, getSelectedTags } from '@/api/getSongListInfo'
import useSongList from '@/hooks/useSongList'

const router = useRouter()
const loading = ref(true)
const activeName = ref('全部')
const more = ref(true)
const tags = ref([] as String[])
const songListsData = ref<SongList[]>([] as SongList[])

const { playSongListById } = useSongList()

function toSongList(id: number) {
  router.push(`/list/${id}`)
}
const params = reactive({
  cat: '全部',
  limit: 20,
  before: 0,
  realIP: '116.25.146.177',
})

// 获取标签
function initTags() {
  getSelectedTags().then((res) => {
    tags.value = res
  })
}

onMounted(() => initTags())

// 通过标签获取歌单列表
function init() {
  loading.value = true
  params.cat = activeName.value
  params.before = 0
  getSelectedSongList(params).then((res) => {
    songListsData.value = res.songList
    params.before = res.lastTime!
    more.value = res.more
  }).then(() => {
    loading.value = false
  })
}

function handleClick() {
  init()
}

// 滚动加载
async function loadMore() {
  await getSelectedSongList(params).then((res) => {
    if (res.songList.length === 0)
      return
    for (const item of res.songList)
      songListsData.value.push(item)
    params.before = res.lastTime!
    more.value = res.more
  })
}

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
</script>

<style>

</style>

<route>
{
  name: "selectedlists",
  meta: {
    keepAlive: true,
  }
}
</route>
