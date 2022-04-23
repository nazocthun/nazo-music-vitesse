<template>
  <div max-w="1300px" my-0 mx-auto p-5>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="全部" />
      <el-tab-pane label="欧美" name="欧美" />
      <el-tab-pane label="华语" name="华语" />
    </el-tabs>
    <CoverView
      :data="songListsData"
      :more="more"
      :show-more="true"
      @load-more="loadMore"
      @play="playSongList"
      @to="toSongList"
    />
  </div>
</template>
<script setup lang="ts">
import { getSelectedSongList } from '@/api/getSongListInfo'

const router = useRouter()
const loading = ref(true)
const activeName = ref('全部')
const more = ref(true)
const songListsData = ref<SongList[]>([] as SongList[])

function playSongList(id: number) {
  console.log(`playSongList${id}`)
}

function toSongList(id: number) {
  router.push(`/list?id=${id}`)
  console.log(`toSongList${id}`)
}
const params = reactive({
  cat: '全部',
  limit: 20,
  before: 0,
  realIP: '116.25.146.177',
})

function init() {
  loading.value = true
  params.cat = activeName.value
  params.before = 0
  getSelectedSongList(params).then((res) => {
    songListsData.value = res.songList
    params.before = res.lastTime
    more.value = res.more
  }).then(() => {
    loading.value = false
  })
}

function handleClick() {
  init()
}
async function loadMore() {
  await getSelectedSongList(params).then((res) => {
    if (res.songList.length === 0) return
    for (const item of res.songList)
      songListsData.value.push(item)
    params.before = res.lastTime
    more.value = res.more
  })
}
</script>
