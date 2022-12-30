import { createApp } from 'vue'
import piniaInstance from './stores/index'
import App from './App.vue'
import router from './router'
import { startMockIfDev } from '@/mock'

startMockIfDev()
const app = createApp(App)

app.use(piniaInstance)
app.use(router)
app.mount('#app')
