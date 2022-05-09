import { createApp } from "vue"
import PreviewImage from "./previewImage.vue"
export default function (piclist: string[], viewIndex: number = 0, downloadnames: string[] = []) {
  if (piclist.length === 0) return
  const div = document.createElement('div')
  const app = createApp(PreviewImage, {
    piclist, // 图片
    viewIndex, // 当前查看的第几张
    downloadnames, // 需要下载时，对应填图片下载时的名称（带后缀）
    onClose: () => {
      div.remove()
      app.unmount()
    }
  })
  app.mount(div)
  div.style.display = 'contents' // 避免被公共div样式覆盖
  div.style.userSelect = 'none'
  document.body.append(div)
}