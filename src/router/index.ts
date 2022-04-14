import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import DiscoverPage from '@/pages/Index/Discover/DiscoverPage.vue'
import SongLists from '@/pages/Index/SongLists/SongLists.vue'
import NewMusic from '@/pages/Index/NewMusic/NewMusic.vue'
import MusicVideo from '@/pages/Index/MusicVideo/MusicVideo.vue'
import AlbumPage from '@/pages/Album/AlbumPage.vue'
import ArtistPage from '@/pages/Artist/ArtistPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: DiscoverPage,
  },
  {
    path: '/songlists',
    name: 'songlists',
    component: SongLists,
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
