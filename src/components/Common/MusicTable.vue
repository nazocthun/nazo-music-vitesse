<template>
  <div w-full mx-auto>
    <el-table
      ref="table"
      v-table-infinite-scroll="loadMore"
      v-table-scroll="scroll"
      v-loading="props.loading"
      stripe
      empty-text="加载中"
      style="width: 100%"
      :data="tableData"
      :max-height="props.maxHeight"
      @row-dblclick="rowDoubleClick"
    >
      <el-table-column type="index" width="50" :index="indexWithPage" />
      <el-table-column v-if="props.pic" width="100">
        <template #default="scope">
          <div class="group" w-16 h-16 relative>
            <img absolute w-full h-full rounded-xl :src="scope.row.picUrl">
            <div
              absolute justify-center items-center cursor-pointer
              w-8 h-8 top="50%" left="50%" translate-x="-50%" translate-y="-50%"
              m-0 bg="white/70" rounded-full group-hover="bg-white transition-all"
              @click="getMusicInfo(scope.row, 'doubleclick')"
            >
              <div
                w-full h-full bg-orange-700 opacity-70 group-hover="opacity-100 transition-all"
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
              <span cursor-pointer text-sky-600 hover="underline underline-offset-2" @click="toArtist(artist.id)">{{ artist.name }}</span>
              <span v-show="scope.row.artists.length !== 1 && i !== scope.row.artists.length - 1" text-gray-600 cursor-default>&nbsp;&amp;&nbsp;</span>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column v-if="props.album" prop="album" label="专辑" width="">
        <template #default="scope">
          <span
            :title="scope.row.album.name"
            flex-initial cursor-pointer text-sky-600 mr-auto pr-4 overflow-hidden text-ellipsis whitespace-nowrap
            hover="underline underline-offset-2"
            @click="toAlbum(scope.row.album.id)"
          >
            {{ scope.row.album.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="add" label="" width="100">
        <template #default="scope">
          <span
            flex float-right mr-4 cursor-pointer w-6 h-6 hover:text-orange-700
            i-ic-sharp-playlist-add
            @click="addToQueue(scope.row, 'plus')"
          />
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时长" width="100">
        <template #default="scope">
          <span text-gray-600 cursor-default>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <template #append>
        <showMore :more="props.more" :show-more="props.showMore" />
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate } from 'vue-router'
import { artistsTitleString } from '@/utils/common'
import usePlay from '@/hooks/usePlay'
import useMusicQueue from '@/hooks/useMusicQueue'

const props = defineProps({
  data: {
    default() {
      return [] as Music[]
    },
    required: true,
  },
  loading: {
    default() {
      return true
    },
    required: true,
  },
  pic: {
    default() {
      return true
    },
    required: true,
  },
  album: {
    default() {
      return true
    },
    required: true,
  },
  more: {
    default() {
      return true
    },
    required: false,
  },
  showMore: {
    default() {
      return true
    },
    required: false,
  },
  maxHeight: {
    default() {
      return '100%'
    },
    required: false,
  },
  page: {
    type: Number,
    default() {
      return undefined
    },
    required: false,
  },
  pageSize: {
    type: Number,
    default() {
      return undefined
    },
    required: false,
  },
})
const em = defineEmits(['loadMore'])
const tableData = ref<Music[]>([] as Music[])

function indexWithPage(index: number) {
  return ((props.page && props.pageSize) ? index + (props.page - 1) * props.pageSize : index) + 1
}

watch(() => props.data, () => {
  tableData.value = props.data
})

onMounted(() => {
  tableData.value = props.data
})
// 播放音乐Hook
const { getMusicInfo, rowDoubleClick } = usePlay()
const { addToQueue } = useMusicQueue()

// 路由跳转
const router = useRouter()
function toArtist(id: any) {
  router.push(`/artist/${id}`)
}
function toAlbum(id: any) {
  router.push(`/album/${id}`)
}

function loadMore() {
  em('loadMore')
}

// keep-alive记住滚动条位置
const table = ref()
defineExpose({ table })

const currentScrollTop = ref(0)
function scroll(height: number) {
  currentScrollTop.value = height
}

onActivated(() => {
  table.value.setScrollTop(currentScrollTop.value)
})

onBeforeRouteUpdate((to, from) => {
  if (to.name === from.name && to.path !== from.path)
    currentScrollTop.value = 0
})
</script>

<style>
.music-table :deep(.el-loading-spinner) {
  top: 50%;
}
</style>
