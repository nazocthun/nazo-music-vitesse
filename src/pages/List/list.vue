<template>
  <div v-loading="loading" max-w="1300px" mx-auto p-5>
    <div class="flex">
      <div w-50 aspect-square>
        <CoverLazy :src="songListInfo.picUrl" />
      </div>
      <div px-5 py-0 flex-1>
        <div text-2xl font-bold flex items-center>
          <div text-orange-700 border="~ solid orange-700" inline-block text-xl mr-2 rounded px-2 py-0 cursor-default>
            歌单
          </div>
          {{ songListInfo.name }}
        </div>
        <div items-center text-sm>
          <div mx="10px" my-5>
            创建者ID：{{ songListInfo.userId }}
          </div>
          <div mx="10px" my-5>
            创建时间：{{ songListInfo.createTime }}
          </div>
          <div mx="10px" my-5>
            共{{ songListInfo.trackCount }}首
          </div>
        </div>
        <!-- <div inline-block mr-2 rounded-2xl bg-orange-700 py-1 px-4 text-white cursor-pointer @click="playSongList(0,tableData)">
          播放全部
        </div> -->
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="歌曲列表" name="music">
        <div w-full>
          <MusicTable :data="tableData" :loading="false" :pic="false" :album="false" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="评论" name="comment" :lazy="true" />
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSongListDetail } from '@/api/getSongListInfo'
import { getSongDetail } from '@/api/getSongDetail'
import useAlbum from '@/hooks/useAlbum'

const loading = ref(true)
const songListId = ref()

// API参数
const params = {
  id: 0,
  realIP: '116.25.146.177',
}

// 通过API获得歌单及歌曲数据
const songListInfo = ref<SongList>()
const tableData = ref<Array<Music>>()

function init() {
  getSongListDetail(params).then((res) => {
    songListInfo.value = res
    return res.trackIds
  }).then((res) => {
    getSongDetail({
      ids: res.join(','),
      realIP: params.realIP,
    }).then((res) => {
      tableData.value = res
    })
  }).then(() => {
    loading.value = false
  })
}

const activeName = ref('music')
function handleClick(tab: any) {
}

// 播放音乐, 加入队列Hook
// const { playAlbum } = useAlbum()

// function playAll() { // TODO: confirm window
//   const allMusic = tableData.value ?? []
//   MUSIC_QUEUE_STORE.$reset()
//   for (const music of allMusic)
//     addToQueueWith(music)
//   changeNowIndexTo(0)
//   getMusicInfo(allMusic[0], 'queue')
// }

// 路由跳转
const route = useRoute()

// 监视路由变化
watch(() => route, (newValue) => {
  songListId.value = newValue.params.id
  params.id = songListId.value
  init()
  // this.getComments(true)

  setTimeout(() => {
    activeName.value = 'first'
    loading.value = false
  }, 0)
})

onMounted(() => {
  songListId.value = route.query.id
  params.id = songListId.value
  init()
})
</script>
