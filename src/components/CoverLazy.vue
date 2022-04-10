<template>
  <div w-full h-full bg-stone-500:10 rounded-xl>
    <el-image rounded-xl :src="props.src">
      <template #placeholder>
        <div w-full h-full flex justify-center items-center>
          <div w="33%" h="33%" i-mdi-loading animate-spin />
        </div>
      </template>
      <template #error>
        <div w-full h-full flex justify-center items-center>
          <div w="33%" h="33%" i-mdi-loading animate-spin />
        </div>
      </template>
    </el-image>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  src: {
    default() {
      return ''
    },
    required: true,
  },
})

</script>

<style>
.el-image {
  width: 100%;
  height: 100%;
}
</style>
