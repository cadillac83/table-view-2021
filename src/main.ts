import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
// import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
// import * as ElIconModules from '@element-plus/icons'
import { Search, List } from '@element-plus/icons'

// const transElIconName = (iconName:any) => {
//     return 'i' + iconName.replace(/[A-Z]/g, (match:any) => '-' + match.toLowerCase())
// }

const app = createApp(App)

app.config.globalProperties = axios

// // 统一注册el-icon图标
// for(let iconName in ElIconModules){
//     app.component(transElIconName(iconName),ElIconModules[iconName])
// }
app.component('search', Search)
app.component('list', List)

app.use(router)
    // .use(store)
    .use(ElementPlus)
    .mount('#app')
