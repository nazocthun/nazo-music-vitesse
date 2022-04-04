import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import DiscoverPage from '@/pages/DiscoverPage.vue'
import SongList from '@/pages/SongList.vue'
import NewMusic from '@/pages/NewMusic.vue'
import MusicVideo from '@/pages/MusicVideo.vue'
import AlbumPage from '@/pages/AlbumPage.vue'
import ArtistPage from '@/pages/ArtistPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: DiscoverPage,
  },
  {
    path: '/songlists',
    name: 'songlists',
    component: SongList,
  },
  {
    path: '/newmusic',
    name: 'newmusic',
    component: NewMusic,
  },
  {
    path: '/musicvideo',
    name: 'musicvideo',
    component: MusicVideo,
  },
  {
    path: '/album',
    component: AlbumPage,
  },
  {
    path: '/artist',
    component: ArtistPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
