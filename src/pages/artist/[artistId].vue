<template>
  <el-scrollbar ref="scrollBar" @scroll="scroll">
    <div v-loading="loading" class="whole-page" my-0 mx-auto p-5>
      <div flex text-sm mb-5>
        <div w-50 h-50 mr="50px">
          <CoverLazy :src="artistInfo.picUrl" />
        </div>
        <div class="artist-top-info-detail">
          <div text-2xl font-bold>
            {{ artistInfo.name }}
          </div>
          <div mt-5 flex>
            <div>
              单曲数：{{ artistInfo.musicSize }}
            </div>
            <div mx-5>
              专辑数：{{ artistInfo.albumSize }}
            </div>
            <div>
              MV数：{{ mvData.length }}
            </div>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="热门歌曲" name="hotMusic">
          <MusicTable :data="musicData" :loading="loading" :pic="false" :album="true" :show-more="false" />
        </el-tab-pane>
        <el-tab-pane label="专辑" name="album" :lazy="true">
          <CoverView
            :data="albumData"
            :more="albumMore"
            :show-more="true"
            @load-more="loadMore"
            @play="playAlbum"
            @to="toAlbum"
          />
        </el-tab-pane>
        <el-tab-pane label="MV" name="mv" :lazy="true">
          <CoverView
            :data="mvData"
            :show-more="false"
            @play="toMV"
            @to="toMV"
          />
        </el-tab-pane>
        <el-tab-pane label="歌手详情" name="detail" :lazy="true">
          <span font-bold text-xl inline-block m-3>个人简介</span>
          <p indent-8 my-4 mx-0 text-base>
            {{ artistIntroduction.briefDesc }}
          </p>
          <div v-for="(item, index) in artistIntroduction.introduction" :key="index">
            <span font-bold text-xl inline-block m-3>
              {{ item.title }}
            </span>
            <p v-for="(x,i) in item.txt" :key="i" indent-8 my-4 mx-0 text-base>
              {{ x }}
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="相似歌手" name="similar" :lazy="true">
          <ul grid grid-cols-5 gap-5 list-none pl-0 m-3>
            <li v-for="(artist, index) in similarArtists" :key="index" w-full>
              <div w-full aspect-square cursor-pointer relative hover="scale-105 transition-all" @click="toArtist(artist.id)">
                <CoverLazy :src="artist.picUrl" />
              </div>
              <div text-sm text-center my="2.5" mx-0 text-stone-800>
                {{ artist.name }}
              </div>
            </li>
            <span v-if="similarArtists.length === 0 && !loading">暂无相似歌手</span>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import {
  getArtistHotAlbum,
  getArtistInfo,
  getArtistIntroduction,
  getArtistMV,
  getSimilarArtistInfo,
} from '@/api/getArtistInfo'
import useAlbum from '@/hooks/useAlbum'

const props = defineProps<{ artistId: string }>()
const router = useRouter()
const loading = ref(true)

// API参数
const params = {
  id: 0,
  limit: 20,
  offset: 0,
}

const artistId = ref()
onMounted(() => {
  artistId.value = props.artistId
  params.id = artistId.value
  initArtistInfo()
})

// 面板激活切换
const activeName = ref('hotMusic')
function handleClick(tab: any) {
  loading.value = true
  if (tab.props.label === '热门歌曲')
    initArtistInfo()
  else if (tab.props.label === '专辑')
    initArtistAlbum()
  else if (tab.props.label === 'MV')
    initMVData()
  else if (tab.props.label === '相似歌手')
    initSimilarArtists()
  else if (tab.props.label === '歌手详情')
    initArtistIntroduction()
}

// 通过API获得数据
const musicData = ref<Music[] | undefined>([] as Music[])
const albumData = ref<Album[]>([] as Album[])
const artistInfo = ref<Artist>({} as Artist)
const albumMore = ref(true)

// 获取艺人信息和热歌
async function initArtistInfo() {
  await getArtistInfo(params).then((res) => {
    artistInfo.value = res.artist
    musicData.value = res.hotMusic
  }).then(() => {
    loading.value = false
  })
}

// 获取艺人专辑 一次20个
async function initArtistAlbum() {
  params.offset = 0
  await getArtistHotAlbum(params).then((res) => {
    albumData.value = res.album
    albumMore.value = res.more
  }).then(() => {
    loading.value = false
  })
}

async function loadMore() {
  params.offset += params.limit
  await getArtistHotAlbum(params).then((res) => {
    if (res.album.length === 0) return
    for (const item of res.album)
      albumData.value.push(item)
    albumMore.value = res.more
  }).then(() => {
    loading.value = false
  })
}

// 获取艺人介绍
const artistIntroduction = ref<Partial<ArtistIntroduction>>({})
async function initArtistIntroduction() {
  await getArtistIntroduction(params).then((res) => {
    artistIntroduction.value.briefDesc = res.briefDesc
    artistIntroduction.value.introduction = res.introduction
  }).then(() => {
    loading.value = false
  })
}

// 获取相似艺人
const similarArtists = ref<Array<ArtistSimple>>([])
async function initSimilarArtists() {
  await getSimilarArtistInfo({ id: artistId.value }).then((res) => {
    similarArtists.value = res
  }).then(() => {
    loading.value = false
  })
}

// 获取MV数据
const mvData = ref<Array<MV>>([])
async function initMVData() {
  params.offset = 0
  await getArtistMV(params).then((res) => {
    mvData.value = res
  }).then(() => {
    loading.value = false
  })
}

const { playAlbum } = useAlbum()

// 路由跳转
function toAlbum(id: number) {
  router.push(`/album/${id}`)
}

function toArtist(id: number) {
  router.push(`/artist/${id}`)
}

function toMV(id: number) {
  router.push(`/mv/${id}`)
}

// keep-alive记住滚动条位置
const currentScrollTop = ref(0)
function scroll({ scrollTop }: { scrollTop: number }) {
  currentScrollTop.value = scrollTop
}
const scrollBar = ref()
onActivated(() => scrollBar.value.setScrollTop(currentScrollTop.value))

// 路由监视，变更艺人时重制页面信息及选中标签
watch(() => props.artistId, () => {
  artistId.value = props.artistId
  params.id = artistId.value
  initArtistInfo().then(() => {
    if (activeName.value === 'similar') {
      activeName.value = 'hotMusic'
      scrollBar.value.setScrollTop(0)
    }
    loading.value = false
  })
})

</script>

<style>
.whole-page {
  max-width: min(calc(100vw - 251px), 1300px);
}
</style>

<route>
{
  name: "artist",
  meta: {
    keepAlive: true,
  }
}
</route>
