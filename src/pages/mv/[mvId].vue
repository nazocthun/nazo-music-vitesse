<template>
  <el-scrollbar ref="scrollBar" @scroll="scroll">
    <div v-loading="loading" class="whole-page" mx-auto p-5 pb-0 flex>
      <div m-5 w="60%">
        <div text-xl font-bold m-3>
          MV详情
        </div>
        <div aspect-video w-full flex>
          <video ref="video" controls :poster="mvDetail.picUrl" :src="mvUrl" h-full w-full />
        </div>
        <div flex items-center mt-6>
          <div h-16 w-16>
            <CoverLazy w-full h-full :src="avatarUrl" shape="circle" />
          </div>
          <div ml-6 text-lg font-semibold cursor-default>
            {{ artistName }}
          </div>
        </div>
        <div mt-6 text-xl font-semibold>
          {{ mvDetail.name }}
        </div>
        <div mt-3 text-sm>
          <span text-gray-400>发布时间：{{ mvDetail.publishTime }}</span>
          <span text-gray-400 ml-5>播放次数：{{ mvDetail.playCount }}</span>
        </div>
        <div mt-3 text-sm w-170>
          {{ mvDetail.desc }}
        </div>
        <div>
          <CommentsView :id="mvId" :type="1" />
        </div>
      </div>
      <div m-5 w="30%">
        <div text-xl font-bold m-3>
          相似MV
        </div>
        <div>
          <CoverView :data="simiMVsData" :show-more="false" :col="1" :show-time="false" @play="toMV" @to="toMV" />
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getMVDetail, getMVUrl } from '@/api/mvAPI/getMVDetail'
import { usePlayStore } from '@/store/PlayStore'
import { getSimiMVs } from '@/api/mvAPI/getSimiMVs'

const props = defineProps<{ mvId: string }>()
const mvId = ref()
const loading = ref(true)
const mvDetail = ref<MV>({} as MV)
const simiMVsData = ref<MV[]>([])
const mvUrl = ref()

const PLAY_STORE = usePlayStore()
const { isPlaying } = storeToRefs(PLAY_STORE)

const avatarUrl = computed(() => {
  try {
    return mvDetail.value.artist.picUrl
  }
  catch (e) {
    return ''
  }
})

const artistName = computed(() => {
  try {
    return mvDetail.value.artist.name
  }
  catch (e) {
    return ''
  }
})

// 播放MV时暂停当前播放音乐
const video = ref()
const playMVPauseMusic = () => {
  isPlaying.value = false
}

async function init() {
  await getMVDetail({ mvid: mvId.value }).then((res) => {
    mvDetail.value = res
    // console.log(mvDetail.value)
  })
  await getMVUrl({ id: mvId.value }).then((res) => {
    mvUrl.value = res
  }).then(() => {
    loading.value = false
  })
  await getSimiMVs({ mvid: mvId.value }).then((res) => {
    simiMVsData.value = res
  })
}

const router = useRouter()
function toMV(id: number) {
  router.push(`/mv/${id}`)
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

onMounted(() => {
  mvId.value = props.mvId
  init()
  video.value.onplay = playMVPauseMusic
})

watch(() => props.mvId, () => {
  loading.value = true
  mvId.value = props.mvId
  init()
})
</script>

<route>
{
  name: "mv",
  meta: {
    keepAlive: true,
  }
}
</route>
