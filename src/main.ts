import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import './styles/main.css'
import 'uno.css'
import '@/styles/custom.scss'

const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

app.directive('tableInfiniteScroll', {
  mounted(el, binding) {
    let tbody = el.querySelector('.el-scrollbar__wrap')
    el.tableInfiniteScrollFn = function() {
      // console.log(this.style.maxHeight)
      if (this.scrollHeight - this.scrollTop - parseInt(this.style.maxHeight) === 0) {
        setTimeout(() => {
          binding.value()
        }, 500)
      }
    }
    tbody.addEventListener('scroll', el.tableInfiniteScrollFn)
    tbody = undefined
    // console.log(tbody)
  },
  unmounted(el) {
    const tbody = el.querySelector('.el-table__body-wrapper')
    tbody.removeEventListener('scorll', el.tableInfiniteScrollFn)
    el.tableInfiniteScrollFn = undefined
  },
})

app.use(router).use(pinia)

app.mount('#app')
