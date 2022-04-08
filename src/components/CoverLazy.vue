<template>
  <div w-full h-full flex justify-center items-center bg-stone-500:10 rounded-xl>
    <el-image w-full h-full rounded-xl :src="props.src">
      <template #placeholder>
        <div w-full h-full flex>
          <div w-18 h-18 i-mdi-loading animate-spin />
        </div>
      </template>
      <template #error>
        <div w-full h-full flex>
          <div w-18 h-18 i-mdi-loading animate-spin />
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
