<template>
  <div>
    <el-carousel ref="bannerRef" :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="(banner, index) in banners" :key="index">
        <img h-full w-full rounded-2xl :src="banner.imageUrl" @click="toTarget(banner)">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { getBanner } from '@/api/getBanner'
import { getSongDetail } from '@/api/getSongDetail'
import usePlay from '@/hooks/usePlay'

const banners = ref<Banner[]>([])
const bannerRef = ref()
onMounted(() => init())
function init() {
  getBanner({ type: 0 }).then((res) => {
    banners.value = res
  }).then(() => bannerRef.value.setActiveItem(0))
}

// Banner点击效果
const router = useRouter()
const { getMusicInfo } = usePlay()
function toTarget(banner: Banner) {
  if (banner.targetType === 1) {
    getSongDetail({ ids: banner.targetId }).then((res) => {
      return res[0]
    }).then((res) => {
      getMusicInfo(res, 'doubleclick')
    })
  }
  else if (banner.targetType === 10) {
    router.push(`/album/${banner.targetId}`)
  }
}
</script>

<style>

</style>
