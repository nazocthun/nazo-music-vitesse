<template>
  <div v-loading="loading" max-w="1300px" mx-auto p-5>
    <div class="flex">
      <div w-50 h-50 flex justify-center items-center bg-stone-500:10 rounded-xl>
        <el-image w-full h-full rounded-xl :src="albumInfo.picUrl">
          <template #placeholder>
            <div w-full h-full flex>
              <div w-18 h-18 i-mdi-loading animate-spin />
            </div>
          </template>
          <template #error>
            <div w-full h-full flex>
              <div w-18 h-18 i-mdi-loading animate-spin />
            </div>
          </template>
        </el-image>
      </div>
      <div px-5 py-0 flex-1>
        <div text-2xl font-bold flex items-center>
          <div text-orange-700 border-solid border border-orange-700 inline-block text-xl mr-2 rounded px-2 py-0 cursor-default>
            专辑
          </div>
          {{ albumInfo.name }}
        </div>
        <div items-center text-sm>
          <div mx="10px" my-5>
            歌手：{{ artistName }}
          </div>
          <div mx="10px" my-5>
            时间：{{ albumInfo.publishTime }}
          </div>
          <div mx="10px" my-5>
            共{{ albumInfo.size }}首
          </div>
        </div>
        <div inline-block mr-2 rounded-2xl bg-orange-700 py-1 px-4 text-white cursor-pointer @click="playAll">
          播放全部
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="歌曲列表" name="music">
        <div w-full>
          <el-table :data="tableData" stripe @row-dblclick="rowDoubleClick">
            <el-table-column type="index" width="50" />
            <el-table-column prop="name" label="音乐标题" width="" />
            <el-table-column prop="artists" label="歌手" width="">
              <template #default="scope">
                <span :title="artistsTitleString(scope.row.artists)">
                  <span v-for="(artist, i) in scope.row.artists" :key="i" overflow-hidden text-ellipsis whitespace-nowrap>
                    <span cursor-pointer text-sky-600 @click="toArtist(artist.id)">{{ artist.name }}</span>
                    <span v-show="scope.row.artists.length != 1 && i!=scope.row.artists.length-1" text-gray-600 cursor-default>&nbsp;&amp;&nbsp;</span>
                  </span>
                </span>
              </template>
            </el-table-column>

            <el-table-column prop="album" label="专辑">
              <template #default="scope">
                <span flex justify-start items-center :title="scope.row.album.name">
                  <span
                    flex-initial cursor-pointer text-sky-600 mr-auto pr-4 overflow-hidden text-ellipsis whitespace-nowrap
                    @click="toAlbum(scope.row.album.id)"
                  >
                    {{ scope.row.album.name }}
                  </span>
                  <span
                    flex float-right mr-4 cursor-pointer w-6 h-6 hover:text-orange-700
                    i-ic-sharp-playlist-add
                    @click="addToQueue(scope.row, 'plus')"
                  />
                </span>
              </template>
            </el-table-column>

            <el-table-column prop="time" label="时长" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="专辑简介" name="descrption">
        <span font-bold text-xl inline-block mx-0 my="2.5">专辑介绍</span>
        <p v-for="(item, index) in albumInfo.description" :key="index" indent-8 my-4 mx-0 text-base>
          {{ item }}
        </p>
      </el-tab-pane>
      <el-tab-pane label="评论" name="comment" />
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAlbumInfo } from '@/api/getAlbumInfo'
import { useMusicInfoStore } from '@/store/MusicInfoStore'
import { useMusicQueueStore } from '@/store/MusicQueueStore'
import { usePlayStore } from '@/store/PlayStore'
import usePlay from '@/hooks/usePlay'
import useMusicQueue from '@/hooks/useMusicQueue'
import { artistsTitleString } from '@/utils/common'

const MUSIC_INFO_STORE = useMusicInfoStore()
const MUSIC_QUEUE_STORE = useMusicQueueStore()
const PLAY_STORE = usePlayStore()

const { currentMusicUrl } = storeToRefs(MUSIC_INFO_STORE)
const { musicQueue, nowIndex } = storeToRefs(MUSIC_QUEUE_STORE)
const { isMusicChanged } = storeToRefs(PLAY_STORE)

const { changeNowIndexTo, clearMusicQueue, addToQueueWith } = MUSIC_QUEUE_STORE

const loading = ref(true)
// const musicQueue = computed(() => store.state.musicQueue)

const albumId = ref()
onMounted(() => {
  albumId.value = route.query.id
  params.id = albumId.value
  init()
})

// API参数
let params = {
  id: 0,
  realIP: '116.25.146.177',
}

// 通过API获得Album数据
const albumInfo = ref<Partial<Album>>({})
// const commentCount = ref()
const artistName = ref<string>('')
const tableData = ref<Array<Music>>()

function init() {
  getAlbumInfo(params).then((res) => {
    console.log(res)
    albumInfo.value = res
    tableData.value = res.music
    console.log(tableData.value)
    artistName.value = res.artist.name
  }).then(() => {
    loading.value = false
  })
}

const activeName = ref('music')
function handleClick(tab: any) {
  console.log(tab)
}

// 播放音乐, 加入队列Hook
const { getMusicInfo, rowDoubleClick } = usePlay()
const { addToQueue } = useMusicQueue()

function playAll() {
  const allMusic = tableData.value ?? []
  console.log(allMusic)
  clearMusicQueue()
  for (const music of allMusic)
    addToQueueWith(music)
  changeNowIndexTo(0)
  getMusicInfo(allMusic[0], 'queue')
}

// 路由跳转
const route = useRoute()
const router = useRouter()
function toArtist(id: number) {
  console.log(id)
  router.push(`/artist?artistId=${id}`)
}
function toAlbum(id: number) {
  console.log(id)
  router.push(`/album?id=${id}`)
}

// 监视路由变化
watch(() => route, (newValue) => {
  albumId.value = newValue.params.id
  params.id = albumId.value
  getAlbumInfo(params)
  // this.getComments(true)

  setTimeout(() => {
    activeName.value = 'first'
    loading.value = false
  }, 0)
})

</script>

<style scoped>

</style>
