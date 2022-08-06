<template>
  <el-scrollbar ref="scrollBar" @scroll="scroll">
    <div v-loading="loading" class="whole-page" mx-auto p-5 pb-0>
      <div class="flex">
        <div w-50 aspect-square>
          <CoverLazy :src="songListInfo.picUrl" />
        </div>
        <div px-5 py-0 flex-1>
          <div text-2xl font-bold flex items-center>
            <div text-orange-700 border="~ solid orange-700" inline-block text-xl mr-2 rounded px-2 py-0 cursor-default select-none>
              歌单
            </div>
            {{ songListInfo.name }}
          </div>
          <div items-center text-sm>
            <div flex="~" items-center my-5>
              <img h-6 w-6 rounded-full mr-2 border="~ solid orange-700" :src="userDetail.avatarUrl">
              <span>{{ userDetail.nickname }}</span>
              <span ml-3>{{ songListInfo.publishTime }}创建</span>
            </div>
            <div my-5>
              歌曲数：{{ songListInfo.trackCount }}
            </div>
          </div>
          <div
            inline-block mr-2 rounded-2xl bg-orange-700 py-1 px-4 text-white cursor-pointer
            @click="playSongList(trackIds)"
          >
            播放全部
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="歌曲列表" name="music">
          <div w-full>
            <MusicTable
              ref="musicTable" :data="tableData" :loading="false" :pic="true" :album="true" :more="more"
              max-height="530px" style="height: auto;" @load-more="loadMore"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="评论" name="comment" :lazy="true">
          <CommentsView :id="songListId" :type="2" />
        </el-tab-pane>
        <el-tab-pane label="相似歌单" name="similarLists" :lazy="true">
          <CoverView
            :data="simlilarListsData" :more="false" :show-more="false" @play="playSongListById"
            @to="toSongList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import useSongList from '@/hooks/useSongList'
import { getSimilarSongList, getSongListDetail } from '@/api/getSongListInfo'
import { getSongDetail } from '@/api/getSongDetail'
import { getUserDetail } from '@/api/getUserName'

const props = defineProps<{ listId: string }>()
const loading = ref(true)
const songListId = ref()

// API参数
const params = {
  id: 0,
  realIP: '116.25.146.177',
}

// 通过API获得歌单及歌曲数据
const songListInfo = ref<SongList>({} as SongList)
const tableData = ref<Music[]>([] as Music[])
const trackIds = ref<Number[]>([] as Number[])
const userDetail = ref<User>({} as User)
const offset = ref(0)
const more = ref(true)

async function init() {
  await getSongListDetail(params).then((res) => {
    songListInfo.value = res
    trackIds.value = res.trackIds
    offset.value = 0
  })
  await getUserDetail({ uid: songListInfo.value.userId }).then((res) => {
    userDetail.value = res
  })
  await getSongDetail({
    ids: getTrackIdsByOffset(offset.value),
    realIP: params.realIP,
  }).then((res) => {
    offset.value += 20
    if (res.length < 20)
      more.value = false
    tableData.value = res
  }).then(() => {
    loading.value = false
  })
}

function getTrackIdsByOffset(currentOffset: number) {
  return trackIds.value.slice(currentOffset, currentOffset + 20).join(',')
}

const activeName = ref('music')
function handleClick(tab: any) {
  loading.value = true
  if (tab.props.label === '歌曲列表')
    init()
  else if (tab.props.label === '相似歌单')
    initSimilarLists()
  loading.value = false
}

function loadMore() {
  if (!more.value || trackIds.value.length === 0)
    return
  getSongDetail({
    ids: getTrackIdsByOffset(offset.value),
    realIP: params.realIP,
  }).then((res) => {
    offset.value += 20
    more.value = offset.value < trackIds.value.length
    tableData.value = tableData.value.concat(res)
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

// 获取相似歌单
const simlilarListsData = ref<SongList[]>([] as SongList[])
function initSimilarLists() {
  getSimilarSongList({
    id: songListId.value,
  }).then((res) => {
    simlilarListsData.value = res
  }).then(() => {
    loading.value = false
  })
}

// 播放音乐, 加入队列Hook
const { playSongList, playSongListById } = useSongList()

// 路由跳转
const router = useRouter()
function toSongList(id: string) {
  router.push(`/list/${id}`)
}
// 监视路由变化
const musicTable = ref()
watch(() => props.listId, () => {
  songListId.value = props.listId
  params.id = songListId.value
  init().then(() => {
    activeName.value = 'music'
  }).then(() => {
    musicTable.value.table.setScrollTop(0)
    loading.value = false
  })
})

onBeforeRouteUpdate((to, from) => {
  if (to.name === from.name && to.path !== from.path)
    musicTable.value.table.setScrollTop(0)
})

onMounted(() => {
  songListId.value = props.listId
  params.id = songListId.value
  init()
})
</script>

<style>
.whole-page {
  max-width: min(calc(100vw - 251px), 1300px);
}
</style>

<route>
{
  name: "list",
  meta: {
    keepAlive: true,
  }
}
</route>
