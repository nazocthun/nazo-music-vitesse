<template>
  <div v-loading="loading" max-w="1300px" mx-auto p-5>
    <div class="flex">
      <div w-50 aspect-square>
        <CoverLazy :src="albumInfo.picUrl" />
      </div>
      <div px-5 py-0 flex-1>
        <div text-2xl font-bold flex items-center>
          <div text-orange-700 border="~ solid orange-700" inline-block text-xl mr-2 rounded px-2 py-0 cursor-default>
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
        <div
          inline-block mr-2 rounded-2xl bg-orange-700 py-1 px-4 text-white cursor-pointer
          @click="playAlbum(0,tableData)"
        >
          播放全部
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="歌曲列表" name="music">
        <div w-full>
          <MusicTable :data="tableData" :loading="false" :pic="false" :album="false" :show-more="false" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="专辑简介" name="descrption" :lazy="true">
        <span font-bold text-xl inline-block mx-0 my="2.5">专辑介绍</span>
        <p v-for="(item, index) in albumInfo.description" :key="index" indent-8 my-4 mx-0 text-base>
          {{ item }}
        </p>
      </el-tab-pane>
      <el-tab-pane label="评论" name="comment" :lazy="true" />
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { getAlbumInfo } from '@/api/getAlbumInfo'
import useAlbum from '@/hooks/useAlbum'

const props = defineProps<{ albumId: string }>()
const loading = ref(true)
const albumId = ref()

// API参数
const params = {
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
    albumInfo.value = res
    tableData.value = res.music
    artistName.value = res.artist.name
  }).then(() => {
    loading.value = false
  })
}

const activeName = ref('music')
function handleClick(tab: any) {
}

// 播放音乐, 加入队列Hook
const { playAlbum } = useAlbum()

// 监视路由变化
watch(() => props.albumId, () => {
  albumId.value = props.albumId
  params.id = albumId.value
  getAlbumInfo(params).then(() => {
    activeName.value = 'first'
    loading.value = false
  })
})

onMounted(() => {
  albumId.value = props.albumId
  params.id = albumId.value
  init()
})
</script>