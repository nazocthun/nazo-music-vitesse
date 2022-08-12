
<template>
  <div>
    <div v-if="props.showMore && props.more" leading="81px" flex justify-center>
      <div flex justify-center items-center>
        <div w-8 h-8 i-mdi-loading animate-spin text-orange-700 />
        <span ml-5 font-medium text-orange-700>加载中</span>
      </div>
    </div>
    <div v-if="props.showMore && !props.more" leading="81px" flex justify-center>
      <span flex justify-center items-center font-medium text-orange-700>没有更多了</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  more: {
    default() {
      return true
    },
    required: false,
  },
  showMore: {
    default() {
      return true
    },
    required: false,
  },
})
</script>
