<template>
  <el-input
    ref="searchbox" v-model="searchValue" class="searchbox" placeholder="搜索" clearable
    @keyup.enter="search(searchValue)" @focus="getSearchHot" @input="getSuggest"
    @clear="showHot = true; showSuggest = false"
  >
    <template #prefix>
      <div i-ic-sharp-search />
    </template>
  </el-input>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="showHot" ref="hotsearch" w="380px" h="550px" fixed right-2 top-16 rounded-md bg-slate-100 box-border
        text-sm drop-shadow z-99
      >
        <el-scrollbar>
          <div mx-3 my-5>
            <div>
              <div flex items-center>
                <span select-none text-lg font-bold>搜索历史</span>
                <div i-ic-sharp-delete hover:color-gray-700 ml-2 cursor-pointer @click="clearHistory" />
              </div>
              <div flex mt-2 flex-wrap>
                <div
                  v-for="(history, index) in searchHistory" :key="index" class="group" flex items-center
                  border-rounded-10 border-1 border-color-gray-300 hover-bg-gray-200 mr-3 my-1 pl-3 py-1 text-sm
                  cursor-pointer @click="search(history)"
                >
                  {{ history }}
                  <div
                    i-ic-sharp-cancel color-gray-600 text-xs ml-1 opacity-0 group-hover-opacity-100
                    hover-color-orange-700 @click.stop="removeHistoryBy(index)"
                  />
                </div>
              </div>
            </div>
            <div>
              <div text-lg font-bold select-none mt-2>
                热搜榜
              </div>
              <div>
                <ul
                  v-for=" (hotSearch, index) in hotSearchData" :key="index" list-none pl-0 my-1 select-none
                  cursor-pointer
                >
                  <li flex items-center class="hover-bg-orange-700/20" p-1 @click="search(hotSearch.searchWord)">
                    <div text-orange-700 w-8 text-xl>
                      <div justify-center items-center>
                        {{ index + 1 }}
                      </div>
                    </div>
                    <div flex-col>
                      <div flex items-center>
                        <span text-base font-500 mr-2>{{ hotSearch.searchWord }}</span>
                        <span text-sm mr-2 text-gray-500>{{ hotSearch.score }}</span>
                        <span v-if="hotSearch.iconUrl !== undefined">
                          <img :src="hotSearch.iconUrl" alt="" h-4>
                        </span>
                      </div>
                      <div text-xs text-gray-500>
                        {{ hotSearch.content }}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="showSuggest" ref="suggestion" w="380px" h="550px" fixed right-2 top-16 rounded-md bg-slate-100
        box-border text-sm drop-shadow z-100
      >
        <div mx-3 my-5>
          <div v-for="(type, index) in suggestData.order" :key="index">
            <div font-500 my-2>
              {{ getLabelBy(type) }}
            </div>
            <div
              v-for="(item, subindex) in suggestData[type as keyof SearchSuggest]" :key="subindex" pl-5 py-2
              class="hover-bg-orange-700/20" cursor-pointer
              @click="handleSuggest(type, (item as Music | ArtistSimple | AlbumSimple | SongListSimple))"
            >
              {{ (item as Music).name }}
              <span v-if="isAlbum(item) || isMusic(item)"> - {{ isAlbum(item) ? item.artist!.name : item.artists[0].name
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getHotSearchDetail } from '@/api/searchAPI/hotSearch'
import { getSearchSuggest } from '@/api/searchAPI/search'
import { useSearchStore } from '@/store/SearchStore'
import { getSongDetail } from '@/api/getSongDetail'
import usePlay from '@/hooks/usePlay'

const SEARCH_STORE = useSearchStore()
const { searchHistory } = storeToRefs(SEARCH_STORE)

const searchValue = ref('')
const searchbox = ref()
const showHot = ref(false)
const showSuggest = ref(false)

const hotsearch = ref()
const suggestion = ref()

onClickOutside(hotsearch, () => { showHot.value = false }, { ignore: [searchbox] })
onClickOutside(suggestion, () => { showSuggest.value = false }, { ignore: [searchbox] })

const suggestData = ref<SearchSuggest>({} as SearchSuggest)
const getSuggest = useDebounceFn(() => {
  if (searchValue.value.length === 0) {
    suggestData.value = {
      order: ['music', 'album', 'artist', 'playlist'],
      songs: [],
      albums: [],
      artists: [],
      playlists: [],
    }
    return
  }
  getSearchSuggest({ keywords: searchValue.value }).then((res) => {
    suggestData.value = res
  })
  showSuggest.value = searchValue.value.length !== 0 && !!suggestData.value.order
  showHot.value = searchValue.value.length === 0 || !suggestData.value.order
}, 500)

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

function loadHistory() {
  searchHistory.value = JSON.parse(localStorage.getItem('searchHistory') ?? '[]')
}

function makeHistory(searchWord: string) {
  const history = localStorage.getItem('searchHistory')
  if (!history) {
    localStorage.setItem('searchHistory', JSON.stringify([searchWord]))
  }
  else {
    const historyData = JSON.parse(history)
    const newHistoryData = [searchWord]
    historyData.forEach((item: string) => {
      if (item !== searchWord)
        newHistoryData.push(item)
    })
    if (newHistoryData.length > 10)
      newHistoryData.pop()
    localStorage.setItem('searchHistory', JSON.stringify(newHistoryData))
    SEARCH_STORE.searchHistory = newHistoryData
  }
}

function removeHistoryBy(index: number) {
  const history = localStorage.getItem('searchHistory')
  if (!history)
    return
  const historyData = JSON.parse(history)
  historyData.splice(index, 1)
  localStorage.setItem('searchHistory', JSON.stringify(historyData))
  SEARCH_STORE.searchHistory = historyData
}

function clearHistory() {
  localStorage.removeItem('searchHistory')
  SEARCH_STORE.searchHistory = []
}

function closePanel() {
  showHot.value = false
  showSuggest.value = false
}

function search(searchWords: string) {
  searchValue.value = searchWords
  closePanel()
  makeHistory(searchValue.value)
  router.push(`/search/${searchValue.value}`)
}

const hotSearchData = ref<HotSearch[]>([] as HotSearch[])
function getSearchHot() {
  if (searchValue.value.length > 0) {
    showSuggest.value = true
    getSuggest()
    return
  }
  if (hotSearchData.value.length === 0) {
    getHotSearchDetail().then((res) => {
      hotSearchData.value = res
    }).then(() => {
      loadHistory()
    })
  }
  showHot.value = true
}

const isMusic = (props: any): props is Music => (props as Music).artists !== undefined
const isAlbum = (props: any): props is AlbumSimple => (props as AlbumSimple).artist !== undefined
</script>

<style lang="scss">
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease-in-out;
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
