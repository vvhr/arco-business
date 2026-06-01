import { createApp } from 'vue'
import 'virtual:uno.css'

import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';

import './styles/index.less'

import App from './App.vue'

const app = createApp(App)

app.use(ArcoVueIcon);
app.mount('#app')
