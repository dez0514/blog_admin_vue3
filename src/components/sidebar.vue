<template>
  <div :class="['side-wrap', mode]">
    <a-menu
      :mode="mode"
      :openKeys="openKeys"
      :selectedKeys="selectedKeys"
      @click="handleRouteClick"
      :theme="sideTheme"
    >
      <template v-for="item in menuList">
        <a-sub-menu
          v-if="
            item.meta &&
            item.meta.icon &&
            item.children &&
            item.children.length > 0
          "
          :key="item.path"
        >
          <template #icon>
            <component :is="item.meta.icon"></component></template>
          <template #title>{{ item.meta.title }}</template>
          <template v-for="inner in item.children" >
            <a-menu-item v-if="inner.meta && inner.meta.icon" :key="inner.path">
              <template #icon
                ><component :is="inner.meta && inner.meta.icon"></component
              ></template>
              {{ inner.meta && inner.meta.title }}
            </a-menu-item>
          </template>
          
        </a-sub-menu>
        <a-menu-item
          v-if="
            item.meta &&
            item.meta.icon &&
            (!item.children || item.children.length === 0)
          "
          :key="item.path"
        >
          <template #icon
            ><component :is="item.meta.icon"></component
          ></template>
          {{ item.meta.title }}
          <a-badge v-if="item.meta.badge" :count="comments" style="position: relative;top: -1px;"/>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, computed, watch } from "vue";
import { asyncRoutes } from "../router";
import { useRouter, useRoute, RouteRecordRaw } from "vue-router";
import { todoStore } from '../store/pinia'
import { storeToRefs } from 'pinia'
import { themeStore } from '../store/themePinia'
import { themeColorList } from '../utils/config'
const themeStores = themeStore()
const { themeColor } = storeToRefs(themeStores)
// console.log('themeColor==', themeColor.value)
const textColor = computed(() => {
  const fidx = themeColorList.findIndex(item => item.theme === themeColor.value)
  if(fidx > -1) {
    return  themeColorList[fidx].color
  } else {
    return '#1890ff'
  }
})
interface Props {
  mode?: string;
  sideTheme?: string
}
const props = withDefaults(defineProps<Props>(), {
  mode: 'inline',
  sideTheme: 'light'
})
const { mode, sideTheme } = toRefs(props)
const store = todoStore()
const { comments } = storeToRefs(store)
console.log('comments==', comments)
const [router, route] = [useRouter(), useRoute()];
const [openKeys, selectedKeys] = [ref<string[]>([]), ref<string[]>([])];
const menuList = ref<RouteRecordRaw[]>([...asyncRoutes]);
const handleRouteClick = ({ item, key, keyPath }: any) => {
  // console.log('key====', item, key, keyPath)
  let routePath = key
  if (key === '/article/create/:id?') {
    routePath = '/article/create'
  }
  selectedKeys.value = [key];
  router.push(routePath);
};
watch(() => route.path, (val) => {
  // console.log('watch.route===', route)
  if(val.indexOf('/article/create') > -1) {
    selectedKeys.value = ['/article/create/:id?'];
  } else {
    selectedKeys.value = [route.path];
  }
  const openArr = route.path.split('/').filter(item => item !== '');
  // console.log('openArr.length====', openArr)
  if (openArr.length >= 2) {
    openKeys.value = ['/' + openArr[0]]
  }
}, { immediate: true})
</script>
<style lang="scss" scoped>
.side-wrap {
  /* &.horizontal {
    height: 100%;
    :deep(.ant-menu-horizontal) {
      border-color: transparent;
    }
  } */
  &.horizontal:deep(.ant-menu-root) {
    height: 63px;
    border: 0;
  }
  &.inline {
    overflow-y: auto;
    max-height: calc(100vh - 64px - 48px);
  }
  &.inline:deep(.ant-menu-root) {
    min-height: calc(100vh - 64px - 48px);
  }
  :deep(.ant-menu-light.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected) {
    $theme: v-bind(textColor);
    background-color: $theme;
    color: #fff;
  }
}
</style>