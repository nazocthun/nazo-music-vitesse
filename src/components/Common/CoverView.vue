<template>
  <div>
    <div>
      <ul
        v-infinite-scroll="loadMore" infinite-scroll-delay="700" grid grid-cols-5 gap-5 items-center list-none pl-0
        m-3
      >
        <li v-for="(item, index1) in props.data" :key="index1" text-sm w-full>
          <div
            class="group" :class="{
              'aspect-video': isMV(item),
              'aspect-square': isAlbum(item) || isSonglist(item),
            }" w-full relative cursor-pointer transition-all hover="scale-105 transition-all"
            @click="$emit('to', item.id)"
          >
            <CoverLazy :src="item.picUrl" />
            <div
              absolute justify-center items-center w-12 h-12 top="50%" left="50%" translate-x="-50%"
              translate-y="-50%" m-0 rounded-full opacity-0 group-hover="bg-white opacity-85 transition-all"
              hover="scale-105 transition-all" transition-all @click.stop="$emit('play', item.id)"
            >
              <div w-full h-full bg-orange-700 i-ic-sharp-play-circle-outline />
            </div>
            <div
              v-if="isMV(item)" flex items-center absolute top-1 right-1 text-white text-xs cursor-default
              drop-shadow="[0_0_2px_rgba(0,0,0,1)]"
            >
              <div i-ic-sharp-play-arrow w-3 h-3 />
              {{ item.playCount }}
            </div>
          </div>
          <div :title="item.name" my="1.5" truncate text-sm cursor-default font-medium text-stone-700>
            {{ item.name }}
          </div>
          <div v-if="!isSimpleSonglist(item) && props.showTime" text-xs cursor-default text-stone-400>
            {{ isSonglist(item) ? `更新时间：${item.updateTime}` : `发布时间：${item.publishTime}` }}
          </div>
          <div v-if="!props.showTime" text-xs cursor-default text-stone-400>
            {{ `${(item as MV).artist.name}` }}
          </div>
        </li>
      </ul>
    </div>
    <ShowMore :more="props.more" :show-more="props.showMore" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    default() {
      return [] as SongList[] | Album[] | MV[]
    },
    required: true,
  },
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
    required: true,
  },
  showTime: {
    default() {
      return true
    },
    required: false,
  },
})

const em = defineEmits(['loadMore', 'play', 'to'])

const isAlbum = (props: any): props is Album => (props as Album).size !== undefined
const isSonglist = (props: any): props is SongList => (props as SongList).trackCount !== undefined || (props as SongList).userId !== undefined
const isSimpleSonglist = (props: any): props is SongList => (props as SongList).userId !== undefined
const isMV = (props: any): props is MV => !isAlbum(props) && !isSonglist(props)

function loadMore() {
  em('loadMore')
}
</script>
