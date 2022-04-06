<template>
  <div v-loading="loading" w-full mx-auto>
    <div>
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
            <span text-gray-600 cursor-default overflow-hidden text-ellipsis whitespace-nowrap :title="scope.row.name">
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="歌手" width="">
          <template #default="scope">
            <span :title="artistsTitleString(scope.row.artists)">
              <span v-for="(artist, i) in scope.row.artists" :key="i" overflow-hidden text-ellipsis whitespace-nowrap>
                <span cursor-pointer text-sky-600 @click="toArtist(artist.id)">{{ artist.name }}</span>
                <span v-show="scope.row.artists.length != 1 && i!=scope.row.artists.length-1" text-gray-600 cursor-default>&nbsp;&amp;&nbsp;</span>
              </span>
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="album" label="专辑" width="">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { artistsTitleString } from '@/utils/common'
import usePlay from '@/hooks/usePlay'
import { getNewMusic } from '@/api/getNewMusic'
import useMusicQueue from '@/hooks/useMusicQueue'

onMounted(() => { init() })
const loading = ref(true)
const props = defineProps({
  type: {
    type: Number,
    default: 0,
    required: true,
  },
})

const tableData = ref<Array<Music>>()

const params = reactive({
  type: props.type,
  realIP: '116.25.146.177',
})

watch(props, (val) => {
  params.type = props.type
  init()
})

function init() {
  loading.value = true
  getNewMusic(params).then((res) => {
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
  router.push(`/artist?artistId=${id}`)
}
function toAlbum(id: any) {
  router.push(`/album?id=${id}`)
}
</script>
