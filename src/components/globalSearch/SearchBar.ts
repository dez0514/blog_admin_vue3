import { h, render } from "vue"
import SearchBar from "./SearchBar.vue"

class SeachBarCreator {
  container: HTMLElement | null;
  isShow: Boolean; // 是否正在显示
  constructor() {
    this.container = document.createElement('div')
    this.container.setAttribute('id', 'globalSearchContainer')
    this.isShow = false
  }
  // 显示
  present() {
    const container = document.getElementById('globalSearchContainer')
    console.log('container==',container)
    if((container && document.body.contains(container)) || this.isShow) {
      console.log('present==dismiss')
      this.dismiss()
    }
    if(!this.container) {
      this.container = document.createElement('div')
      this.container.setAttribute('id', 'globalSearchContainer')
    }
    const searchBar = h(SearchBar)
    render(searchBar, this.container)
    document.body.insertBefore(this.container, document.body.firstChild)
    this.isShow = true
  }
  // 隐藏
  dismiss() {
    console.log('container==', this.container)
    const container = document.getElementById('globalSearchContainer')
    if(this.container) {
      render(null, this.container)
      if(document.body.contains(this.container)){
        document.body.removeChild(this.container)
      } else {
        if(container && document.body.contains(container)) {
          document.body.removeChild(container)
        }
      }
    } else {
      if(container && document.body.contains(container)) {
        document.body.removeChild(container)
      }
    }
    this.container = null
    this.isShow = false
  }
}

export default SeachBarCreator