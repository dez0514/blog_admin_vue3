<template>
   <a-layout>
    <a-layout-header>
      <vheader :collapsed="isCollapse"></vheader>
    </a-layout-header>
    <a-layout class="content">
      <a-layout-sider theme='light' :collapsed="isCollapse" :collapsedWidth="60" :width="256" :trigger="null" collapsible>
        <sidebar></sidebar>
        <div class="custom-trigger" :style="{textAlign: !isCollapse ? 'right' : 'center'}">
          <a-tooltip placement="top">
            <template #title>
              <span>展开</span>
            </template>
            <menu-unfold-outlined v-show="isCollapse" class="icon" @click="handleCollapse" />
          </a-tooltip>
          <a-tooltip placement="top">
            <template #title>
              <span>收起</span>
            </template>
            <menu-fold-outlined v-show="!isCollapse" class="icon" @click="handleCollapse" />
          </a-tooltip>
        </div>
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
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
const isCollapse = ref(false)
const handleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>
<style lang="scss">
body,html {
  font-size: 16px;
}
</style>
<style lang="scss" scoped>
:deep(.ant-layout-header) {
  padding: 0;
}
.content {
  height: calc(100vh - 64px);
  /* &:deep(.ant-layout-sider-trigger) {
    display: none;
    border-top: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
  } */
  .custom-trigger {
    box-sizing: border-box;
    padding: 0 10px;
    height: 47px;
    line-height: 47px;
    color: #000;
    border-top: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
    font-size: 20px;
    width: inherit;
    .icon {
      cursor: pointer;
    }
  }
}
.main {
  overflow-y: auto;
  padding-top: 20px;
  background: #fff;
  height: calc(100vh - 64px - 85px);
}
</style>