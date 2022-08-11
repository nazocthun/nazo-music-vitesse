<template>
  <div w="380px" h="550px" fixed right-2 top-16 rounded-md bg-slate-100 box-border text-sm drop-shadow z-99>
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
            <ul list-none pl-0 my-1 select-none cursor-pointer>
              <li
                v-for=" (hotSearch, index) in props.hotSearchData" :key="index"
                flex items-center class="hover-bg-orange-700/20" p-1 @click="search(hotSearch.searchWord)"
              >
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
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/store/SearchStore'
const props = defineProps({
  hotSearchData: {
    default: () => [] as HotSearch[],
    required: true,
  },
})
const em = defineEmits(['search'])
const SEARCH_STORE = useSearchStore()
const { searchHistory } = storeToRefs(SEARCH_STORE)

function search(searchWords: string) {
  em('search', searchWords)
}

function clearHistory() {
  localStorage.removeItem('searchHistory')
  SEARCH_STORE.searchHistory = []
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
</script>

<style>

</style>
