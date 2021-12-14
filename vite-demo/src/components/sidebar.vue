<template>
  <div class="side-wrap">
    <a-menu
      mode="inline"
      :openKeys="openKeys"
      :selectedKeys="selectedKeys"
      @click="handleRouteClick"
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
          <template #icon
            ><component :is="item.meta.icon"></component
          ></template>
          <template #title>{{ item.meta.title }}</template>
          <a-menu-item v-for="inner in item.children" :key="inner.path">
            <template #icon
              ><component :is="inner.meta && inner.meta.icon"></component
            ></template>
            {{ inner.meta && inner.meta.title }}
          </a-menu-item>
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
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue";
import { asyncRoutes } from "@/router";
import { useRouter, useRoute, RouteRecordRaw } from "vue-router";
const [router, route] = [useRouter(), useRoute()];
const [openKeys, selectedKeys] = toRefs([ref<string[]>([]), ref<string[]>([])]);
const menuList = ref<RouteRecordRaw[]>([...asyncRoutes]);
const handleRouteClick = ({ key }: { key: string }) => {
  selectedKeys.value = [key];
  router.push(key);
};

onMounted(() => {
  selectedKeys.value = [route.path];
  const openArr = route.path.split("/");
  if (openArr.length > 1) {
    openKeys.value = ["/" + openArr[1]];
  }
});
</script>
<style lang="scss" scoped>
.side-wrap {
  overflow-y: auto;
  max-height: calc(100vh - 64px - 48px);
}
</style>