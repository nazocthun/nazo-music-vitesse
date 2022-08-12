<template>
  <div
    w-full h-full bg-stone-500:10
    :class="{
      'rounded-xl': props.shape === 'square',
      'rounded-full': props.shape === 'circle',
    }"
  >
    <el-image
      shadow-lg
      :class="{
        'rounded-xl': props.shape === 'square',
        'rounded-full': props.shape === 'circle',
      }"
      :src="props.src"
    >
      <template #placeholder>
        <div w-full h-full flex justify-center items-center bg-blueGray />
      </template>
      <template #error>
        <div w-full h-full flex justify-center items-center>
          <div w="33%" h="33%" ic:sharp-error-outline />
        </div>
      </template>
    </el-image>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default() {
      return ''
    },
    required: true,
  },
  shape: {
    type: String,
    default() {
      return 'square'
    },
    required: false,
  },
})
</script>

<style>
.el-image {
  width: 100%;
  height: 100%;
}
</style>
