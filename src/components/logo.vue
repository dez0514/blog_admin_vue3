<template>
  <div :class="['logo-wrap', props.isInSideBar ? 'inside':'']" v-if="props.visiable" :style="{ width: props.isInSideBar && props.isCollapse ? '60px' : '256px' }">
    <read-outlined class="logo-icon" />
    <span v-show="!props.isCollapse">博客管理系统</span>
  </div>
</template>
<script setup lang="ts">
import { ReadOutlined } from '@ant-design/icons-vue'
  interface Props {
    visiable?: boolean;
    isInSideBar?: boolean; //logo 默认在header里, 布局切换可能在 sidebar里
    isCollapse?:boolean;
  }
  const props = withDefaults(defineProps<Props>(), {
    visiable: true,
    isInSideBar: false,
    isCollapse: false
  })
</script>
<style lang="scss" scoped>
.logo-wrap {
  line-height: 64px;
  box-sizing: border-box;
  padding: 0 18px;
  text-align: left;
  color: var(--theme-header-color);
  &.inside {
    border-right: 1px solid var(--theme-side-rightborder);
    color: var(--theme-side-color);
  }
  .logo-icon {
    margin-right: 10px;
    position: relative;
    top: 3px;
    font-size: 22px;
  }
}
</style>