import { Component, createApp } from 'vue'
import App from '@/App.vue'
import router from './router'
// import store from './store/vuex'
import './app.less'
import { createPinia } from 'pinia'
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
// import Vue3ColorPicker from "vue3-colorpicker";
// import "vue3-colorpicker/style.css";


let theme = localStorage.getItem('theme')
if (!theme) {
    theme = 'default'
}
window.document.documentElement.setAttribute('data-theme', theme)
const app: Component<Element> = createApp(App)
app.use(router)
app.use(createPinia())
app.component('md-editor', MdEditor)
// app.use(Vue3ColorPicker)
// app.use(store)
app.mount('#app')




