<template>
  <div class="custom-trigger" :style="{ textAlign: !isCollapse ? 'right' : 'center' }">
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
</template>
<script setup lang="ts">
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { configStore } from '../store/configPinia'
import { storeToRefs } from 'pinia'
const configStores = configStore()
const { isCollapse } = storeToRefs(configStores)
const handleCollapse = () => {
  configStores.updateCollapse(!isCollapse.value)
}
</script>
<style lang="scss" scoped>
.custom-trigger {
  box-sizing: border-box;
  padding: 0 10px;
  height: 47px;
  line-height: 47px;
  border-top: 1px solid var(--theme-side-boder-color);
  border-right: 1px solid var(--theme-side-rightborder);
  color: var(--theme-side-color);
  font-size: 20px;
  width: inherit;

  .icon {
    cursor: pointer;
  }
}
</style>