<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="全部" name="全部" />
    <el-tab-pane label="欧美" name="欧美" />
    <el-tab-pane label="华语" name="华语" />
  </el-tabs>
  <div>
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-delay="700"
      grid grid-cols-5 gap-5 items-center list-none pl-0 m-3
    >
      <li v-for="(songList, index1) in songListsData" :key="index1" text-sm w-full>
        <div class="group" w-full aspect-square relative cursor-pointer hover="scale-105 transition-all" @click="toSongList(songList.id)">
          <CoverLazy :src="songList.picUrl" />
          <div
            absolute justify-center items-center
            w-12 h-12 top="50%" left="50%" translate-x="-50%" translate-y="-50%"
            m-0 rounded-full opacity-0 group-hover="bg-white opacity-100 transition-all"
            @click.stop="playSongList(songList.id)"
          >
            <div
              w-full h-full bg-orange-700
              i-ic-sharp-play-circle-outline
            />
          </div>
        </div>
        <div :title="songList.name" my="1.5" overflow-hidden text-ellipsis whitespace-nowrap text-sm>
          {{ songList.name }}
        </div>
        <div text-xs>
          {{ songList.createTime }}
        </div>
      </li>
    </ul>
  </div>
  <div v-if="showMore && more" h-16>加载中</div>
  <div v-if="!more" h-16>没有更多了</div>
</template>
<script setup lang="ts">
import { getSelectedSongList } from '@/api/getSongListInfo'

const loading = ref(true)
const activeName = ref('全部')
const more = ref(true)
const showMore = ref(true)
const songListsData = ref<SongList[]>([] as SongList[])

function playSongList(id: number) {

}

function toSongList(id: number) {

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
