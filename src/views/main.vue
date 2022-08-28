<template>
  <a-layout>
    <a-layout-header v-if="themeOpts.menuType !== 'rowColumn'" :style="{ background: (themeOpts.menuStyle === 'darkLight' || themeOpts.menuStyle === 'light') ? '#fff':'#000' }">
      <vheader />
    </a-layout-header>
    <a-layout-sider v-if="themeOpts.menuType === 'rowColumn'" :theme="(themeOpts.menuStyle === 'lightDark' || themeOpts.menuStyle === 'light') ? 'light':'dark'" :collapsed="isCollapse" :collapsedWidth="60"
      :width="256" :trigger="null" collapsible>
      <logo :isInSideBar="true" :isCollapse="isCollapse"/>
      <sidebar :sideTheme="(themeOpts.menuStyle === 'lightDark' || themeOpts.menuStyle === 'light') ? 'light':'dark'"></sidebar>
      <sidebar-trigger />
    </a-layout-sider>
    <a-layout class="content">
      <a-layout-sider v-if="themeOpts.menuType === 'columnRow'" :theme="(themeOpts.menuStyle === 'lightDark' || themeOpts.menuStyle === 'light') ? 'light':'dark'" :collapsed="isCollapse"
        :collapsedWidth="60" :width="256" :trigger="null" collapsible>
        <sidebar :sideTheme="(themeOpts.menuStyle === 'lightDark' || themeOpts.menuStyle === 'light') ? 'light':'dark'"></sidebar>
        <sidebar-trigger />
      </a-layout-sider>
      <a-layout-header v-if="themeOpts.menuType === 'rowColumn'"  :style="{ background: (themeOpts.menuStyle === 'darkLight' || themeOpts.menuStyle === 'light') ? '#fff':'#000' }">
        <vheader />
      </a-layout-header>
      <a-layout-content>
        <bread />
        <div class="main" @scroll="handleScrollPage">
          <router-view></router-view>
        </div>
        <setting />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import logo from '@components/logo.vue'
import sidebar from '@components/sidebar.vue'
import SidebarTrigger from '@components/sidebar_trigger.vue'
import vheader from '@components/header.vue'
import bread from '@components/bread.vue'
import setting from '@components/setting.vue'
import { computed } from 'vue';
import { storeToRefs } from 'pinia'
import { themeStore } from '../store/themePinia'
import { configStore } from '../store/configPinia'
import { emitter } from '../utils/useEmit'
import { useRoute } from "vue-router";
const route = useRoute()
const configStores = configStore()
const { isCollapse } = storeToRefs(configStores)
const themeStores = themeStore()
const { themeColor, menuStyle, menuType } = storeToRefs(themeStores)
const themeOpts = computed(() => {
  return { themeColor: themeColor.value, menuStyle: menuStyle.value, menuType: menuType.value }
})
// 布局原因，@scroll 只能写在这
const handleScrollPage = (e: any) => {
  // console.log(e) // 滚动距离
  if (route.name === 'articleDetail') { // 详情页时触发该页面的事件
    emitter.emit('pageScrollCallback', e.srcElement)
  }
}
</script>
<style lang="scss">
body,
html {
  font-size: 16px;
}
</style>
<style lang="scss" scoped>
:deep(.ant-layout-header) {
  padding: 0;
}

.content {
  height: calc(100vh - 64px);
}

.main {
  position: relative;
  overflow-y: auto;
  padding-top: 20px;
  background: #fff;
  height: calc(100vh - 64px - 85px);
}
</style>