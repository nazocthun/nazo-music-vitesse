import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import 'uno.css'
import '@/styles/custom.scss'

const app = createApp(App)

app.use(router).use(createPinia())

app.mount('#app')
