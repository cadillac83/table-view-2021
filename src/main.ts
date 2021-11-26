import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
// import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
const app = createApp(App)

app.use(router)
// app.use(store)
app.use(ElementPlus)
app.mount('#app')
