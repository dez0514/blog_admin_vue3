import { defineStore } from 'pinia'
import { themeStorage } from '../types'

export const themeStore = defineStore('theme', {
  state: (): themeStorage => ({
    themeColor: '',
    menuStyle: '',
    menuType: ''
  }),
  getters: {
    getThemeConfig(state: themeStorage): themeStorage {
      return state
    }
  },
  actions: {
    updateThemeConfig(payload: themeStorage) {
      this.themeColor = payload.themeColor
      this.menuStyle = payload.menuStyle
      this.menuType = payload.menuType
    }
  },
})