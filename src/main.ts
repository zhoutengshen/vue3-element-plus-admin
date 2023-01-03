import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { createApp } from 'vue'
import piniaInstance from './stores/index'
import App from './App.vue'
import router from './router'
import { startMockIfDev } from '@/mock'
import '@/styles/index.scss'

startMockIfDev()
const app = createApp(App)

app.use(piniaInstance)
app.use(router)
app.mount('#app')
Nprogress.configure({ showSpinner: false })
