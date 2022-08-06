<template>
  <el-scrollbar ref="scrollBar" style="height:100%" @scroll="scroll">
    <div class="whole-page" my-0 mx-auto p-5>
      <div class="select-wrapper">
        <span class="select-name">地区：</span>
        <ul class="select-tabs">
          <li v-for="(area, index) in areas" :key="index" @click="handleClick('area', area)">
            <span class="select-label" :class="{ active: selectedArea === area }">{{ area }}</span>
          </li>
        </ul>
      </div>

      <div class="select-wrapper">
        <span class="select-name">类型：</span>
        <ul class="select-tabs">
          <li v-for="(type, index) in types" :key="index" @click="handleClick('type', type)">
            <span class="select-label" :class="{ active: selectedType === type }">{{ type }}</span>
          </li>
        </ul>
      </div>

      <div class="select-wrapper">
        <span class="select-name">排序：</span>
        <ul class="select-tabs">
          <li v-for="(order, index) in orders" :key="index" @click="handleClick('order', order)">
            <span class="select-label" :class="{ active: selectedOrder === order }">{{ order }}</span>
          </li>
        </ul>
      </div>

      <CoverView :data="MVData" :more="more" :show-more="true" :show-time="false" @load-more="loadMore" @play="toMV" @to="toMV" />
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { getAllMVs } from '@/api/mvAPI/getAllMVs'

const selectedArea = ref('全部')
const selectedType = ref('全部')
const selectedOrder = ref('上升最快')
const areas = ['全部', '内地', '港台', '欧美', '日本', '韩国']
const types = ['全部', '官方版', '原声', '现场版', '网易出品']
const orders = ['上升最快', '最热', '最新']
const router = useRouter()
const more = ref(true)
let offset = 0
const MVData = ref<MV[]>([] as MV[])

function handleClick(tab: 'area' | 'type' | 'order', value: string) {
  switch (tab) {
    case 'area':
      selectedArea.value = value
      break
    case 'type':
      selectedType.value = value
      break
    case 'order':
      selectedOrder.value = value
      break
  }
  offset = 0
  MVData.value = []
  init()
}

async function loadMore() {
  await getAllMVs({ area: selectedArea.value, type: selectedType.value, order: selectedOrder.value, offset }).then((res) => {
    if (res.length === 0) {
      more.value = false
      return
    }
    for (const item of res)
      MVData.value.push(item)
    offset += 30
  })
}

function init() {
  getAllMVs({ area: selectedArea.value, type: selectedType.value, order: selectedOrder.value, offset }).then((res) => {
    MVData.value = res
    offset += 30
  })
}

function toMV(id: number) {
  router.push(`/mv/${id}`)
}

// keep-alive记住滚动条位置
const currentScrollTop = ref(0)
const scrollDebouncedFn = useDebounceFn((scrollTop) => {
  currentScrollTop.value = scrollTop
}, 500, { maxWait: 2000 })

const scroll = ({ scrollTop }: { scrollTop: number }) => {
  scrollDebouncedFn(scrollTop)
}

const scrollBar = ref()
onActivated(() => scrollBar.value.setScrollTop(currentScrollTop.value))
</script>

<style scoped>
.select-wrapper {
  @apply flex items-center mb-3 text-size-14px;
}

.select-tabs {
  @apply flex text-gray-500 list-none p-0 my-2;
}

.select-tabs li {
  @apply not-last-of-type-b-r-gray-200 not-last-of-type-border-r-1 w-35 flex;
}

.select-tabs li span {
  @apply mx-3 py-1 px-5 cursor-pointer box-border w-full justify-center text-center;
}

.select-tabs .active {
  @apply text-orange-700 bg-orange-700/10 border-rounded-full;
}
.select-label {
  @apply transition-all;
}
</style>

<route>
{
  name: "musicvideo",
  meta: {
    keepAlive: true,
  }
}
</route>
