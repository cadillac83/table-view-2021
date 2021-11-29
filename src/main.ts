import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
// import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import registeIcons from '@/icons'

const app = createApp(App)

registeIcons(app)

app.use(router)
    // .use(store)
    .use(ElementPlus)
    .mount('#app')
