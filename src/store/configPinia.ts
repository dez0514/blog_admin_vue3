import { defineStore } from 'pinia'
import { ConfigState } from '../types/store'

export const configStore = defineStore('config', {
  state: (): ConfigState => ({
    isCollapse: false
  }),
  getters: {
    getCommonConfig(state: ConfigState): ConfigState {
      return state
    }
  },
  actions: {
    updateCollapse(payload: boolean) {
      this.isCollapse = payload
    }
  },
})