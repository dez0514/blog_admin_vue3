import { Component, createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
// import store from './store/vuex'
import './app.less'
import { createPinia } from 'pinia'


let theme = localStorage.getItem('theme')
if (!theme) {
    theme = 'default'
}
window.document.documentElement.setAttribute('data-theme', theme)
const app: Component<Element> = createApp(App)
app.use(router)
app.use(createPinia())
// app.use(store)
app.mount('#app')




