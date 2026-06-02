import { createApp } from 'vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import 'virtual:uno.css'

import '@/styles/index.less'
import './styles/index.less'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(router)
app.use(ArcoVueIcon)
app.mount('#app')
