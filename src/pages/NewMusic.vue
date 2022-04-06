<template>
  <div max-w="1300px" mx-auto p-5>
    <div w-full>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0" />
        <el-tab-pane label="华语" name="7" />
        <el-tab-pane label="欧美" name="96" />
        <el-tab-pane label="日语" name="8" />
        <el-tab-pane label="韩语" name="16" />
      </el-tabs>
      <MusicTable :type="type" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeName = ref('0')
const type = ref(0)
function handleClick(tab: any) {
  type.value = Number(activeName.value)
}

</script>

<style scoped>
/* .new-music :deep(.el-loading-spinner) {
  top: 50%;
} */
</style>
