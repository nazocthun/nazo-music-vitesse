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
      <HotSearch v-if="showHot" id="hotsearch" ref="hotsearch" :hot-search-data="hotSearchData" @search="search" />
    </transition>
    <transition name="fade">
      <SearchSuggest
        v-if="showSuggest && suggestData" id="suggestion" ref="suggestion" :suggest-data="suggestData"
        :search-value="searchValue" @search="search" @close-panel="closePanel"
      />
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getHotSearchDetail } from '@/api/searchAPI/hotSearch'
import { getSearchSuggest } from '@/api/searchAPI/search'
import { useSearchStore } from '@/store/SearchStore'

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

const router = useRouter()

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
