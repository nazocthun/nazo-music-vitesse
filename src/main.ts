import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import 'uno.css'
import '@/styles/custom.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(router).use(pinia)

app.mount('#app')
