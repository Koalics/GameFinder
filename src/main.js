import { createApp } from 'vue'
import { Icon, addCollection } from '@iconify/vue'
import mdi from '@iconify-json/mdi/icons.json'
import simpleIcons from '@iconify-json/simple-icons/icons.json'
import './style.css'
import App from './App.vue'
import { router } from './router'

addCollection(mdi)
addCollection(simpleIcons)

const app = createApp(App)
app.component('Icon', Icon)
app.use(router)
app.mount('#app')
