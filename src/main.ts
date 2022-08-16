import { App, createApp } from 'vue'
import AppVue from '@/App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { message, notification } from 'ant-design-vue';
import MdEditor from 'md-editor-v3';
import "@/styles/reset.scss";
import './app.less'
import 'md-editor-v3/lib/style.css';
import 'ant-design-vue/es/message/style'
import 'ant-design-vue/es/notification/style'
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import './styles/md/index.less'
import { copyTextByDom } from './utils/dom'
// 复制代码
const copyCode = () => {
  copyTextByDom('copy-code-btn', {
    deep: true,
    success: () => {
      message.success('代码复制成功~')
    },
    error: () => {
      message.error('代码复制失败~')
    }
  })
}
const _window = window as any
_window.copyCode = copyCode

// MdEditor.config({
//   editorExtensions: {
//     highlight: {
//       css: {
//         atom: {
//           light:
//             'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-light.min.css',
//           dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-dark.min.css'
//         },
//         xxx: {
//           light:
//             'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/xxx-light.css',
//           dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/xxx-dark.css'
//         }
//       }
//     }
//   }
// });

let themeObjStr = localStorage.getItem('theme')
let theme = 'default'
if (themeObjStr) {
  theme = JSON.parse(themeObjStr).themeColor
}
window.document.documentElement.setAttribute('data-theme', theme)
const app: App<Element> = createApp(AppVue)
console.log('app===',app)
app.use(createPinia())
app.use(router)
app.component('md-editor', MdEditor)
app.use(Vue3ColorPicker)
app.config.globalProperties.$message = message
app.config.globalProperties.$notification = notification
app.provide('$message', message)
app.provide('$notification', notification)
app.mount('#app')




