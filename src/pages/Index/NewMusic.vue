<template>
  <el-scrollbar ref="scrollBar" style="height:100%" @scroll="scroll">
    <div max-w="1300px" mx-auto p-5>
      <div w-full>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="0" />
          <el-tab-pane label="华语" name="7" />
          <el-tab-pane label="欧美" name="96" />
          <el-tab-pane label="日语" name="8" />
          <el-tab-pane label="韩语" name="16" />
        </el-tabs>
        <MusicTable
          :data="tableData"
          :loading="loading"
          :pic="true"
          :album="true"
          :height="'100%'"
          :show-more="false"
        />
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { getNewMusic } from '@/api/getNewMusic'

const activeName = ref('0')
const params = reactive({
  type: 0,
  realIP: '116.25.146.177',
})

const tableData = ref<Array<Music>>()
const loading = ref(true)

function handleClick(tab: any) {
  init()
}

function init() {
  loading.value = true
  params.type = Number(activeName.value)
  getNewMusic(params).then((res) => {
    tableData.value = res
  }).then(() => {
    loading.value = false
  })
}

// keep-alive记住滚动条位置
const currentScrollTop = ref(0)
function scroll({ scrollTop }: { scrollTop: number }) {
  currentScrollTop.value = scrollTop
}
const scrollBar = ref()
onActivated(() => scrollBar.value.setScrollTop(currentScrollTop.value))

onMounted(() => {
  init()
})

</script>

<route>
{
  name: "newmusic",
  meta: {
    keepAlive: true,
  }
}
</route>
