<template>
  <el-scrollbar ref="scrollBar" style="height:100%" @scroll="scroll">
    <div class="whole-page" mx-auto p-5>
      <div class="tab-chooser" absolute z-100 bg-white h-16 translate-y--5 w-full right-auto>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="0" />
          <el-tab-pane label="华语" name="7" />
          <el-tab-pane label="欧美" name="96" />
          <el-tab-pane label="日语" name="8" />
          <el-tab-pane label="韩语" name="16" />
        </el-tabs>
      </div>
      <div relative top-16 />
      <MusicTable :data="tableData" :loading="loading" :pic="true" :album="true" height="100%" :show-more="false" />
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { getNewMusic } from '@/api/indexAPI/getNewMusic'

const activeName = ref('0')
const params = reactive({
  type: 0,
})

const tableData = ref<Array<Music>>()
const loading = ref(true)
const scrollBar = ref()

function scrollToTop() {
  scrollBar.value.setScrollTop(0)
}

function handleClick(tab: any) {
  init()
  scrollToTop()
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
const scrollDebouncedFn = useDebounceFn((scrollTop) => {
  currentScrollTop.value = scrollTop
}, 500, { maxWait: 2000 })

const scroll = ({ scrollTop }: { scrollTop: number }) => {
  scrollDebouncedFn(scrollTop)
}

onActivated(() => scrollBar.value.setScrollTop(currentScrollTop.value))

onMounted(() => init())
</script>

<style>
.tab-chooser {
  max-width: min(calc(100vw - 251px), 1300px);
  min-width: 1104px;
}
</style>

<route>
{
  name: "newmusic",
  meta: {
    keepAlive: true,
  }
}
</route>
