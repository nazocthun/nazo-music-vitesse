<template>
  <div w="20%" min-w="380px" h="66%" fixed right-2 bottom-16 rounded-t-md bg-white box-border text-sm shadow-2xl>
    <div h-full>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="播放列表" name="playList">
          <div flex text-stone-400 pb-2 mx-2 my-3 border-b border-t-0 border-l-0 border-r-0>
            <div flex-1>
              共{{ musicQueue.length }}首
            </div>
            <div text-orange-700 float-right cursor-pointer @click="clear">
              清空列表
            </div>
          </div>
          <ul h-full relative p-0>
            <el-scrollbar style="height:100%">
              <li
                v-for="music in musicQueue"
                :key="music.id"
                class="queue-item"
                :class="{'active-item':music.id==currentMusicInfo.id}"
                @dblclick="queueDoubleClick(music)"
              >
                <div v-show="showPlayIcon(music)" w="0.875rem" h="0.875rem" overflow-hidden flex absolute left="5px">
                  <div bg-orange-700 w-1 mx-px h-full class="playingIcon1" />
                  <div bg-orange-700 w-1 mx-px h-full class="playingIcon2" />
                  <div bg-orange-700 w-1 mx-px h-full class="playingIcon3" />
                </div>
                <span :class="{'':isMusicPaused && music.id===currentMusicInfo.id}" />
                <span w="40%" mx-6 overflow-hidden text-ellipsis whitespace-nowrap>{{ music.name }}</span>

                <div w="43.3%" overflow-hidden text-ellipsis whitespace-nowrap text-sky-600>
                  <span v-for="(artist ,i) in music.artists" :key="i" @click.stop="toArtist(artist.id)">{{ artist.name }}&nbsp;</span>
                </div>

                <span w="16.7">{{ music.time }}</span>
                <span class="queue-song-delete" @click="deleteQueue(music.id)">×</span>
              </li>
            </el-scrollbar>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="播放历史" name="history">
          播放历史
        </el-tab-pane>
      </el-tabs>
      <div
        v-if="!musicQueue.length"
        text-stone-400 cursor-default
        absolute top="50%" left="50%"
        translate-x="-50%" translate-y="-50%"
      >
        队列是空的
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeToRefs } from 'pinia'
import usePlay from '@/hooks/usePlay'
import { useMusicInfoStore } from '@/store/MusicInfoStore'
import { useMusicQueueStore } from '@/store/MusicQueueStore'
import { usePlayStore } from '@/store/PlayStore'

const MUSIC_INFO_STORE = useMusicInfoStore()
const MUSIC_QUEUE_STORE = useMusicQueueStore()
const PLAY_STORE = usePlayStore()

const { currentMusicInfo } = storeToRefs(MUSIC_INFO_STORE)
const { nowIndex, musicQueue, deleteToNext } = storeToRefs(MUSIC_QUEUE_STORE)
const { changQueueStyleTo, changeNowIndexTo, deleteMusicBy, clearMusicQueue, toggleDeleteToNext } = MUSIC_QUEUE_STORE
const { isMusicPaused } = storeToRefs(PLAY_STORE)

const activeName = ref('playList')
const { getMusicInfo, queueDoubleClick } = usePlay()
function showPlayIcon(music: Music) {
  return music.id === currentMusicInfo.value.id && !isMusicPaused.value
}

function handleClick(tab: any) {
  console.log(tab)
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
    MUSIC_INFO_STORE.$reset()
    setTimeout(() => {
      clearMusicQueue()
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

function deleteQueue(id: number) { // TODO:
  //   console.log(id)
  ElMessageBox.confirm('确定删除该歌曲吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const ids = []
    for (const item of musicQueue.value)
      ids.push(item.id)
    const indexOfId = ids.indexOf(id)
    setTimeout(() => {
      changQueueStyleTo('delete')
      deleteMusicBy(id)
      if (indexOfId < nowIndex.value) { // 删除的是当前播放之前的歌曲
        changeNowIndexTo(nowIndex.value - 1)
      }
      else if (indexOfId === nowIndex.value) { // 删除的是当前播放的歌曲
        toggleDeleteToNext()
      }
    }, 300)
    setTimeout(() => {
      changQueueStyleTo('normal')
    }, 300)
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除',
    })
  })
}

// 监视删除状态
watch(deleteToNext, () => {
  // 队列中还有音乐播放下一首
  if (nowIndex.value < musicQueue.value.length)
    getMusicInfo(musicQueue.value[nowIndex.value], 'queue')
  // 队列中没有音乐重置
  if (musicQueue.value.length === 0) {
    MUSIC_INFO_STORE.$reset()
    PLAY_STORE.$reset()
    // 如果打开歌词页面 则关闭
    // this.$parent.show = true
    setTimeout(() => {
      MUSIC_QUEUE_STORE.$reset()
    }, 100)
  }
  // 当前播放是队列最后一首，跳回第一首
  if (nowIndex.value === musicQueue.value.length) {
    console.log(nowIndex.value, musicQueue.value.length)
    changeNowIndexTo(0)
  }
})

watch(nowIndex, () => {
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
  cursor: pointer;
}

.queue-item:nth-of-type(even) {
  background-color: #fafafa;
}

.queue-item:not(.active-item):hover {
  background-color: #f5f6fa;
  color: rgb(2, 132, 199);
}

.queue-item:hover .queue-song-delete {
  display: block;
}
.queue-song-delete {
  cursor: pointer;
  margin-right: 3rem;
  color: rgb(168, 162, 158);
  display: none;
}

.active-item {
  color: rgb(194, 65, 12);
  position: relative;
}

</style>
