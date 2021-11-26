import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
// import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

const app = createApp(App)
app.config.globalProperties = axios

app.use(router)
    // .use(store)
    .use(ElementPlus)
    .mount('#app')
console.log('app', app)
