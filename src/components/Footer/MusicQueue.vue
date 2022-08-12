<template>
  <div w="380px" h="550px" fixed right-2 bottom-16 rounded-md bg-white box-border text-sm shadow-2xl>
    <div h="550px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="播放列表" name="playList">
          <div flex text-stone-400 pb-2 mx-2 my-3 border-b border-t-0 border-l-0 border-r-0>
            <div flex-1 ml-4 cursor-default>
              共{{ musicQueue.length }}首
            </div>
            <div mr-4 text-orange-700 float-right cursor-pointer @click="clear">
              清空列表
            </div>
          </div>
          <ul h="430px" p-0>
            <el-scrollbar height="430px">
              <li
                v-for="music in musicQueue"
                :key="music.id"
                class="queue-item"
                :class="{ 'active-item': music.id === currentMusicInfo.id }"
                @dblclick="queueDoubleClick(music)"
              >
                <span flex w="92%">
                  <div v-show="showPlayIcon(music)" w="0.875rem" h="0.875rem" overflow-hidden flex absolute left="5px">
                    <div bg-orange-700 w-1 mx-px h-full class="playingIcon1" />
                    <div bg-orange-700 w-1 mx-px h-full class="playingIcon2" />
                    <div bg-orange-700 w-1 mx-px h-full class="playingIcon3" />
                  </div>
                  <span :class="{ '': isPlaying && music.id === currentMusicInfo.id }" />
                  <span
                    w="35%" ml-6 px-1 overflow-hidden text-ellipsis whitespace-nowrap
                    :title="music.name"
                  >
                    {{ music.name }}
                  </span>
                  <span
                    w="43.3%" cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-sky-600
                    :title="artistsTitleString(music.artists)"
                  >
                    <span v-for="(artist, i) in music.artists" :key="i">
                      <span
                        hover="underline underline-offset-2"
                        @click.stop="toArtist(artist.id)"
                      >
                        {{ artist.name }}
                      </span>
                      <span
                        v-if="music.artists.length !== 1 && i !== music.artists.length - 1"
                        text-gray-600 cursor-default
                      >
                        &nbsp;&amp;&nbsp;
                      </span>
                    </span>
                  </span>
                  <span px-1 w="16.7%" text-right>{{ music.time }}</span>
                </span>
                <span
                  v-if="!onDeleting.includes(music.id)"
                  w="8%"
                  i-ic-sharp-cancel
                  class="queue-song-delete-icon"
                  @click="onDeletingQueue(music.id)"
                />
                <span
                  v-if="onDeleting.includes(music.id)"
                  w="8%"
                  i-ic-sharp-cancel
                  class="queue-song-delete-confirm"
                  @click="deleteQueue(music.id)"
                />
              </li>
            </el-scrollbar>
          </ul>
          <div
            v-if="!musicQueue.length"
            text-stone-400 cursor-default
            absolute top="50%" left="50%"
            translate-x="-50%" translate-y="-50%"
          >
            队列是空的
          </div>
        </el-tab-pane>
        <el-tab-pane label="播放历史" name="history">
          <div flex text-stone-400 pb-2 mx-2 my-3 border-b border-t-0 border-l-0 border-r-0>
            <div flex-1 ml-4 cursor-default>
              共{{ musicHistory.length }}首
            </div>
            <div mr-4 text-orange-700 float-right cursor-pointer @click="clearHistory">
              清空播放历史
            </div>
          </div>
          <ul h="430px" p-0>
            <el-scrollbar height="430px">
              <li
                v-for="music in musicHistory"
                :key="music.id"
                class="queue-item"
                @dblclick="historyDoubleClick(music)"
              >
                <span flex w="92%">
                  <span
                    w="35%" ml-6 px-1 overflow-hidden text-ellipsis whitespace-nowrap
                    :title="music.name"
                  >
                    {{ music.name }}
                  </span>
                  <span
                    w="43.3%" cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-sky-600
                    :title="artistsTitleString(music.artists)"
                  >
                    <span v-for="(artist, i) in music.artists" :key="i">
                      <span
                        hover="underline underline-offset-2"
                        @click.stop="toArtist(artist.id)"
                      >
                        {{ artist.name }}
                      </span>
                      <span
                        v-if="music.artists.length !== 1 && i !== music.artists.length - 1"
                        text-gray-600 cursor-default
                      >
                        &nbsp;&amp;&nbsp;
                      </span>
                    </span>
                  </span>
                  <span px-1 w="16.7%" text-right>{{ music.time }}</span>
                </span>
              </li>
            </el-scrollbar>
          </ul>
          <div
            v-if="!musicHistory.length"
            text-stone-400 cursor-default
            absolute top="50%" left="50%"
            translate-x="-50%" translate-y="-50%"
          >
            暂无播放历史
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import usePlay from '@/hooks/usePlay'
import { artistsTitleString } from '@/utils/common'
import { useMusicInfoStore } from '@/store/MusicInfoStore'
import { useMusicQueueStore } from '@/store/MusicQueueStore'
import { usePlayStore } from '@/store/PlayStore'

const em = defineEmits(['clear'])
const MUSIC_INFO_STORE = useMusicInfoStore()
const MUSIC_QUEUE_STORE = useMusicQueueStore()
const PLAY_STORE = usePlayStore()

const { currentMusicInfo } = storeToRefs(MUSIC_INFO_STORE)
const { nowIndex, musicQueue, musicHistory, deleteToNext } = storeToRefs(MUSIC_QUEUE_STORE)
const { changeQueueStyleTo, changeNowIndexTo, deleteMusicBy, toggleDeleteToNext } = MUSIC_QUEUE_STORE
const { isPlaying } = storeToRefs(PLAY_STORE)

const activeName = ref('playList')
const { getMusicInfo, queueDoubleClick, historyDoubleClick } = usePlay()

function showPlayIcon(music: Music) {
  return music.id === currentMusicInfo.value.id && isPlaying.value
}

function handleClick(tab: any) {
  // console.log(tab)
}

function clear() {
  if (musicQueue.value.length === 0) {
    ElMessage({
      message: '已经是空的了~',
      type: 'warning',
      showClose: true,
    })
    return
  }
  ElMessageBox.confirm('确定清空列表吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    MUSIC_INFO_STORE.reset()
    setTimeout(() => {
      MUSIC_INFO_STORE.reset()
      PLAY_STORE.reset()
      MUSIC_QUEUE_STORE.resetQueue()
      em('clear')
    }, 100)
    ElMessage({
      type: 'success',
      message: '已清空',
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消清空',
    })
  })
}

function clearHistory() {
  if (musicHistory.value.length === 0) {
    ElMessage({
      message: '已经是空的了~',
      type: 'warning',
      showClose: true,
    })
    return
  }
  ElMessageBox.confirm('确定清空播放历史吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    setTimeout(() => {
      MUSIC_QUEUE_STORE.resetMusicHistory()
    }, 100)
    ElMessage({
      type: 'success',
      message: '已清空',
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消清空',
    })
  })
}

const onDeleting = ref<Array<number>>([])

function onDeletingQueue(id: number) {
  onDeleting.value.push(id)
  setTimeout(() => {
    for (const [i, item] of onDeleting.value.entries()) {
      if (item === id) {
        onDeleting.value.splice(i, 1)
        break
      }
    }
  }, 3000)
}

function deleteQueue(id: number) { // TODO:
  const ids = []
  for (const item of musicQueue.value)
    ids.push(item.id)
  const indexOfId = ids.indexOf(id)
  setTimeout(() => {
    changeQueueStyleTo('delete')
    deleteMusicBy(id)
    if (indexOfId < nowIndex.value) { // 删除的是当前播放之前的歌曲
      changeNowIndexTo(nowIndex.value - 1)
    }
    else if (indexOfId === nowIndex.value) { // 删除的是当前播放的歌曲
      toggleDeleteToNext()
    }
    for (const [i, item] of onDeleting.value.entries()) {
      if (item === id) {
        onDeleting.value.splice(i, 1)
        break
      }
    }
  }, 500)
  setTimeout(() => {
    changeQueueStyleTo('normal')
  }, 1000)
}

// 监视删除状态
watch(deleteToNext, () => {
  // 队列中还有音乐播放下一首
  if (nowIndex.value < musicQueue.value.length)
    getMusicInfo(musicQueue.value[nowIndex.value], 'queue')
  // 队列中没有音乐重置
  if (musicQueue.value.length === 0) {
    setTimeout(() => {
      changeQueueStyleTo('delete')
      MUSIC_INFO_STORE.reset()
      PLAY_STORE.reset()
      MUSIC_QUEUE_STORE.resetQueue()
    }, 500)
    setTimeout(() => {
      changeQueueStyleTo('normal')
    }, 1000)
  }
  // 当前播放是队列最后一首，跳回第一首
  if (nowIndex.value === musicQueue.value.length)
    changeNowIndexTo(0)
})

watch(nowIndex, () => {
  // if (isPlaying.value)
  getMusicInfo(musicQueue.value[nowIndex.value], 'queue')
})

const router = useRouter()
function toArtist(id: number) {
  router.push(`/artist?artistId=${id}`)
}
</script>

<style lang="scss">
.el-tabs__header {
  margin: 0.75rem;
}

.playingIcon1 {
  /* transform: translate3d(0,0,0); */
  animation: playingIcon;
  animation-duration: .5s;
  animation-delay: 0;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
  animation-direction: alternate-reverse;
}
.playingIcon2 {
  /* transform: translate3d(0,4px,0); */
  animation: playingIcon;
  animation-duration: .5s;
  animation-delay: .2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
  animation-direction: alternate-reverse;
}

.playingIcon3 {
  /* transform: translate3d(0,8px,0); */
  animation: playingIcon;
  animation-duration: .5s;
  animation-delay: .5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
  animation-direction: alternate-reverse;
}

@keyframes playingIcon {
  from {
    transform: translate3d(0,0,0);
  }
  to {
    transform: translate3d(0,80%,0);
  }
}

.queue-item {
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: white;
  color: black;
  cursor: default;
}

.queue-item:nth-of-type(even) {
  background-color: #fafafa;
}

.queue-item:not(.active-item):hover {
  background-color: #f5f6fa;
  color: rgb(2, 132, 199);
}

.queue-item:hover .queue-song-delete-icon {
  display: block;
}
.queue-song-delete-icon {
  cursor: pointer;
  margin-right: auto;
  color: rgb(168, 162, 158);
  display: none;
}

.queue-song-delete-confirm {
  cursor: pointer;
  margin-right: auto;
  color: rgb(194, 65, 12);
}

.active-item {
  color: rgb(194, 65, 12);
  position: relative;
}
</style>
