<template>
  <router-view />
  <div class="outest-loading" v-show="showLoading">
    <a-spin size="large" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { changeTheme, defaultTheme } from "./utils";
import { themeColorList } from "./utils/config";
import { useLoading } from './utils/useLoading'
import useSearch from './components/globalSearch/useSearch';
const { openSearchBar } = useSearch
const { showLoading } = useLoading()
// 全局搜索快捷键
const keyDownEvt = (e: any) => {
  // console.log('keydown==', e)
  if((e.ctrlKey || e.metaKey) && e.keyCode === 75) {
    // ctrl + k || command + k
    e.preventDefault() // 阻止浏览器默认动作
    openSearchBar()
  }
}
onMounted(() => {
  let themeObjStr = localStorage.getItem("theme");
  // console.log("主题色值===", theme);
  let theme = defaultTheme.themeColor
  if (themeObjStr) {
    theme = JSON.parse(themeObjStr).themeColor
    let index = themeColorList.findIndex((fitem) => fitem.theme === theme)
    if (index > -1) {
      changeTheme(theme, { primaryColor: themeColorList[index].color });
    }
  } else {
    changeTheme(theme);
  }
  window.addEventListener('keydown', keyDownEvt)
});
onUnmounted(() => {
  window.removeEventListener('keydown', keyDownEvt)
})
</script>
<style lang="scss" scoped>
.outest-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, .7);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
