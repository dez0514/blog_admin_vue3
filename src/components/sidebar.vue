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
import { onMounted, ref, toRefs, reactive } from "vue";
import { asyncRoutes } from "../router";
import { useRouter, useRoute, RouteRecordRaw } from "vue-router";
import { todoStore } from '../store/pinia'
import { storeToRefs } from 'pinia'
import { themeStore } from '../store/themePinia'
import { themeColorList } from '../utils/config'
import { computed } from "@vue/reactivity";
const themeStores = themeStore()
const { themeColor } = storeToRefs(themeStores)
// console.log('themeColor==', themeColor.value)
const textColor = computed(() => {
  const fidx = themeColorList.findIndex(item => item.theme === themeColor.value)
  if(fidx > -1) {
    return themeColorList[fidx].color
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
const handleRouteClick = ({ key }: { key: string }) => {
  selectedKeys.value = [key];
  router.push(key);
};

onMounted(() => {
  console.log('props=====', props)
  selectedKeys.value = [route.path];
  const openArr = route.path.split("/");
  if (openArr.length > 1) {
    openKeys.value = ["/" + openArr[1]];
  }
});
</script>
<style lang="scss" scoped>
$theme: v-bind(textColor);
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
  /* :deep(.ant-menu-light.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected) {
    background-color: rgba($color: $theme, $alpha: .8); // mix(#fff, $theme, 91.6%); //  $theme;
  } */
}
</style>