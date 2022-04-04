<template>
  <div v-loading="loading" max-w="1300px" mx-auto p-5>
    <div w-full>
      <el-table :data="tableData" stripe style="width: 100%" @row-dblclick="rowDoubleClick">
        <el-table-column type="index" width="50" />
        <el-table-column width="100">
          <template #default="scope">
            <div w-16 h-16 relative>
              <img absolute w-full h-full rounded-xl class="table-cover-img" :src="scope.row.picUrl">
              <div
                absolute justify-center items-center cursor-pointer
                w-8 h-8 top="50%" left="50%" translate-x="-50%" translate-y="-50%"
                m-0 bg="white/80" rounded-full
                @click="getMusicInfo(scope.row, 'doubleclick')"
              >
                <div
                  w-full h-full bg-orange-700
                  i-ic-sharp-play-circle-outline
                />
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="音乐标题" width="">
          <template #default="scope">
            <div inline-block text-gray-600 cursor-default>
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="歌手" width="">
          <template #default="scope">
            <div v-for="(artist, i) in scope.row.artists" :key="i" inline-block>
              <span cursor-pointer text-sky-600 @click="toArtist(artist.id)">{{ artist.name }}</span>
              <span v-show="scope.row.artists.length != 1 && i!=scope.row.artists.length-1" text-gray-600 cursor-default>
                &amp;&nbsp;
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="album" label="专辑" width="">
          <template flex #default="scope">
            <div flex justify-start items-center>
              <div
                flex-initial cursor-pointer text-sky-600 mr-auto
                @click="toAlbum(scope.row.album.id)"
              >
                {{ scope.row.album.name }}
              </div>
              <div
                flex float-right mr-4 cursor-pointer w-6 h-6 hover:text-orange-700
                i-ic-sharp-playlist-add
                @click="addToQueue(scope.row, 'plus')"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时长" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import usePlay from '@/hooks/usePlay'
import { getNewMusic } from '@/api/getNewMusic'
import useMusicQueue from '@/hooks/useMusicQueue'

const loading = ref(true)

// API参数
const params = {
  type: 0,
  realIP: '116.25.146.177',
}

onMounted(() => { init() })

// 通过API获得最新歌曲信息
const tableData = ref<Array<Music>>()
async function init() {
  loading.value = true
  await getNewMusic(params).then((res) => {
    tableData.value = res
  }).then(() => {
    loading.value = false
  })
}

// 播放音乐Hook
const { getMusicInfo, rowDoubleClick } = usePlay()
const { addToQueue } = useMusicQueue()

// 路由跳转
const router = useRouter()
function toArtist(id: any) {
  console.log(id)
  router.push(`/artist?artistId=${id}`)
}
function toAlbum(id: any) {
  console.log(id)
  router.push(`/album?id=${id}`)
}
</script>

<style scoped>
/* .new-music :deep(.el-loading-spinner) {
  top: 50%;
} */
</style>
