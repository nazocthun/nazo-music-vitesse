<template>
  <div w="380px" h="550px" fixed right-2 top-16 rounded-md bg-slate-100 box-border text-sm drop-shadow z-100>
    <div mx-3 my-2>
      <div text-gray-500 hover:text-black cursor-pointer @click="search(props.searchValue)">
        搜「<span text-sky-600>{{ props.searchValue }}</span>」相关的结果 >
      </div>
      <div v-for="(type, index) in props.suggestData.order" :key="index">
        <div font-500 my-2 text-gray-500>
          {{ getLabelBy(type) }}
        </div>
        <div
          v-for="(item, subindex) in props.suggestData[type as keyof SearchSuggest]" :key="subindex" pl-5 py-2
          class="hover-bg-orange-700/20" cursor-pointer
          @click="handleSuggest(type, (item as Music | ArtistSimple | AlbumSimple | SongListSimple))"
        >
          {{ (item as Music).name }}
          <span v-if="isAlbum(item)"> - {{ item.artist!.name }}</span>
          <span v-if="isMusic(item)"> - {{ item.artists.map((ar) => ar.name).toString().replaceAll(',', ' ') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import usePlay from '@/hooks/usePlay'
import { getSongDetail } from '@/api/getSongDetail'
const props = defineProps({
  suggestData: {
    default: () => {
      return {} as SearchSuggest
    },
    required: true,
  },
  searchValue: {
    default: () => {
      return ''
    },
    required: true,
  },
})
const em = defineEmits(['closePanel', 'search'])

function search(searchWords: string) {
  em('search', searchWords)
}

function getLabelBy(type: string) {
  switch (type) {
    case 'albums':
      return '专辑'
    case 'songs':
      return '单曲'
    case 'playlists':
      return '歌单'
    case 'artists':
      return '歌手'
    default:
      return ''
  }
}

function closePanel() {
  em('closePanel')
}

const router = useRouter()
const { getMusicInfo } = usePlay()
function handleSuggest(type: string, item: Music | ArtistSimple | AlbumSimple | SongListSimple) {
  switch (type) {
    case 'songs':
      getSongDetail({ ids: item.id }).then((res) => {
        return res[0]
      }).then((res) => {
        getMusicInfo(res, 'doubleclick')
      })
      closePanel()
      break
    case 'albums':
      router.push(`/album/${item.id}`)
      closePanel()
      break
    case 'artists':
      router.push(`/artist/${item.id}`)
      closePanel()
      break
    case 'playlists':
      router.push(`/list/${item.id}`)
      closePanel()
      break
  }
}

const isMusic = (props: any): props is Music => (props as Music).artists !== undefined
const isAlbum = (props: any): props is AlbumSimple => (props as AlbumSimple).artist !== undefined
</script>

<style>

</style>
