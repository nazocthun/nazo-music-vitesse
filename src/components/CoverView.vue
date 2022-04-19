<template>
  <div>
    <div>
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-delay="700"
        grid grid-cols-5 gap-5 items-center list-none pl-0 m-3
      >
        <li v-for="(item, index1) in props.data" :key="index1" text-sm w-full>
          <div class="group" w-full aspect-square relative cursor-pointer hover="scale-105 transition-all" @click="$emit('to', item.id)">
            <CoverLazy :src="item.picUrl" />
            <div
              absolute justify-center items-center
              w-12 h-12 top="50%" left="50%" translate-x="-50%" translate-y="-50%"
              m-0 rounded-full opacity-0 group-hover="bg-white opacity-100 transition-all"
              @click.stop="$emit('play', item.id)"
            >
              <div
                w-full h-full bg-orange-700
                i-ic-sharp-play-circle-outline
              />
            </div>
          </div>
          <div :title="item.name" my="1.5" truncate text-sm cursor-default>
            {{ item.name }}
          </div>
          <div text-xs cursor-default>
            {{ item.hasOwnProperty('updateTime') ? item.updateTime : item.publishTime }}
          </div>
        </li>
      </ul>
    </div>
    <div v-if="props.more" h-16>
      加载中
    </div>
    <div v-if="!props.more" h-16>
      没有更多了
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    default() {
      return [] as SongList[] | Album[]
    },
    required: true,
  },
  more: {
    default() {
      return true
    },
    required: true,
  },
})

const em = defineEmits(['load-more', 'play', 'to'])

function loadMore() {
  em('load-more')
}
</script>
