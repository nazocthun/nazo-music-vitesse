<template>
  <!-- {{ data }} -->
  <div v-if="comments.length !== 0">
    <div mt-3 mb-6 font-semibold text-2xl>
      热门评论
    </div>
    <div v-for="(hotComment, index1) in hotComments" :key="index1">
      <CommentBar :comment="hotComment" />
    </div>
    <div mt-3 mb-6 font-semibold text-2xl>
      最新评论
    </div>
    <div v-for="(comment,index2) in comments" :key="index2">
      <CommentBar :comment="comment" />
    </div>
  </div>
  <div v-else mt-3 mb-6 font-semibold text-2xl>
    暂无评论
  </div>
</template>

<script setup lang="ts">
import { getComment, getHotComment } from '@/api/getComments'

const props = defineProps({
  id: {
    default() {
      return ''
    },
    required: true,
  },
  type: {
    default() {
      return 3
    },
    required: true,
  },
})

const hotComments = ref<MusicComment[]>([] as MusicComment[])
const comments = ref<MusicComment[]>([] as MusicComment[])

function init() {
  getHotComment({ id: props.id, type: props.type, limit: 10 }).then((res) => {
    hotComments.value = res
  })
  getComment({ id: props.id, type: props.type, sortType: 3 }).then((res) => {
    console.log(res)
    comments.value = res
  })

}

onMounted(() => init())

watch(() => props.id, () => {
  init()
})
</script>

<style>

</style>
