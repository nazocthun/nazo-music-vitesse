import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import DiscoverPage from '@/pages/Index/index.vue'
import CustomLists from '@/pages/Index/CustomLists.vue'
import SelectedLists from '@/pages/Index/SelectedLists.vue'
import NewMusic from '@/pages/Index/NewMusic.vue'
import MusicVideo from '@/pages/Index/MusicVideo.vue'
import AlbumPage from '@/pages/Album/album.vue'
import ArtistPage from '@/pages/Artist/artist.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: DiscoverPage,
  },
  {
    path: '/customlists',
    name: 'customlists',
    component: CustomLists,
  },
  {
    path: '/selectedlists',
    name: 'selectedlists',
    component: SelectedLists,
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
