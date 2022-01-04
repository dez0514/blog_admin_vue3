<template>
   <a-layout>
    <a-layout-header>
      <vheader></vheader>
    </a-layout-header>
    <a-layout class="content">
      <a-layout-sider theme='light' v-model="isCollapse" :collapsedWidth="60" collapsible :width="256">
        <sidebar></sidebar>
      </a-layout-sider>
      <a-layout-content>
        <bread></bread>
        <div class="main">
          <router-view></router-view>
        </div>
        <setting></setting>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import sidebar from '@components/sidebar.vue'
import vheader from '@components/header.vue'
import bread from '@components/bread.vue'
import setting from '@components/setting.vue'
import { ref } from 'vue';
// import { MenuUnfoldOutlined } from '@ant-design/icons-vue'
const isCollapse = ref(true)
</script>
<style lang="scss">
body,html {
  font-size: 16px;
}
</style>
<style lang="scss" scoped>
.content {
  height: calc(100vh - 64px);
  &:deep(.ant-layout-sider-trigger) {
    border-top: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
  }
}
.main {
  overflow-y: auto;
  /* margin: 20px 0 0 20px; */
  padding: 20px;
  background: #fff;
  height: calc(100vh - 64px - 85px);
}
</style>