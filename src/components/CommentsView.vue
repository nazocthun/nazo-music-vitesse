<template>
  <!-- {{ data }} -->
  <div v-if="hasComments()">
    <div v-if="hasHotComments()" mt-3 mb-6 font-bold text-xl>
      热门评论
    </div>
    <div v-for="(hotComment, index1) in hotComments" :key="index1">
      <CommentBar :comment="hotComment" />
    </div>
    <div id="comments-label" mt-3 mb-6 font-bold text-xl>
      最新评论
    </div>
    <div v-for="(comment, index2) in comments" :key="index2">
      <CommentBar :comment="comment" />
    </div>
    <div items-center justify-center flex>
      <el-pagination
        background hide-on-single-page layout="prev, pager, next" :total="totalCount" :page-size="20"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <div v-else mt-3 mb-6 font-bold text-xl>
    暂无评论
  </div>
</template>

<script setup lang="ts">
import { getComment, getHotComment } from '@/api/commentAPI/getComments'

const props = defineProps({
  id: {
    default() {
      return ''
    },
    required: true,
  },
  type: {
    default() {
      return 3 // 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
    },
    required: true,
  },
})

const hotComments = ref<MusicComment[]>([] as MusicComment[])
const comments = ref<MusicComment[]>([] as MusicComment[])
const cursor = ref()
const totalCount = ref(0)

const hasHotComments = () => {
  return hotComments.value.length !== 0
}

const hasComments = () => {
  return comments.value.length !== 0
}

function scrollToLabel() {
  document.querySelector('#comments-label')?.scrollIntoView()
}

function handleCurrentChange(val: number) {
  getComment({ id: props.id, type: props.type, sortType: 3, pageNo: val, cursor: cursor.value }).then((res) => {
    comments.value = res.comments
    cursor.value = res.cursor
  }).then(() => {
    scrollToLabel()
  })
}

function init() {
  getHotComment({ id: props.id, type: props.type, limit: 10 }).then((res) => {
    hotComments.value = res
  })
  getComment({ id: props.id, type: props.type, sortType: 3 }).then((res) => {
    comments.value = res.comments
    cursor.value = res.cursor
    totalCount.value = res.totalCount
  })
}

onMounted(() => {
  if (!hasComments() && props.id !== '')
    init()
})

watch(() => props.id, () => {
  init()
})
</script>

<style>

</style>
