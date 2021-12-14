import { Component, createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from './store'

let theme = localStorage.getItem('theme')
console.log('主题色值===', theme)
if (!theme) theme = 'default'
window.document.documentElement.setAttribute('data-theme', theme)
const app: Component<Element> = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')




