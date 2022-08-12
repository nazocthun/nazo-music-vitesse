<template>
  <div flex m-3 mb-6 cursor-default>
    <img w-12 h-12 rounded-full border="1.5px solid orange-700" mr-2 :src="props.comment.user.avatarUrl" alt="">
    <div flex-col w-full>
      <div mb-2 text-sm>
        <span text-sky-600>
          {{ props.comment.user.nickname }}
        </span>
        <span>
          ：{{ props.comment.content }}
        </span>
      </div>
      <div v-if="props.comment.beRepliedComment.length !== 0" bg-gray-100 my-2 p-2>
        <div v-for="(replies, reply_index) in comment.beRepliedComment" :key="reply_index" flex mb-2 text-sm>
          <div text-sky-600>
            {{ replies.user.nickname }}
          </div>
          <div>
            ：{{ replies.content }}
          </div>
        </div>
      </div>
      <div flex relative bottom-0 items-center text-gray-500 text-sm border-b-1 border-gray-200 pb-6>
        <div w-24>
          {{ props.comment.timeStr }}
        </div>
        <div ml-12 i-carbon-thumbs-up />
        <div ml-1>
          {{ props.comment.likedCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  comment: {
    default() {
      return {} as MusicComment
    },
    required: true,
  },
})
</script>
