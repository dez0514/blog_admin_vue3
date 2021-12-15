import { Component, createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from './store'
import './app.less'

let theme = localStorage.getItem('theme')
if (!theme) {
    theme = 'default'
}
window.document.documentElement.setAttribute('data-theme', theme)
const app: Component<Element> = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')




