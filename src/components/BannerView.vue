<template>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="(banner, index) in props.banners" :key="index">
      <img h-full rounded-2xl :src="banner.imageUrl">
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
import { getSongDetail } from '@/api/getSongDetail'
import usePlay from '@/hooks/usePlay'

const props = defineProps({
  banners: {
    default() {
      return [] as Banner[]
    },
    required: true,
  },
})

// Banner点击效果 需登陆 暂时弃用
const router = useRouter()
const { getMusicInfo } = usePlay()
function toTarget(banner: Banner) {
  if (banner.targetType === 1) {
    getSongDetail({ id: banner.targetId }).then((res) => {
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
