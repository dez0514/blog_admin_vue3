<template>
  <div class="bread">
    <a-breadcrumb class="bread-word">
      <a-breadcrumb-item v-for="(item,index) in breadCrumbArr" :key="index">{{item}}</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="title">{{ route.meta && route.meta.title }}</div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
const route = useRoute();
const breadCrumbArr = computed(() => route.matched.filter(item => item.meta.title).map(item => item.meta.title))
</script>
<style lang="scss" scoped>
.bread {
  overflow: hidden;
  padding: 0 20px;
  background: #fff;
}
.bread-word,
.title {
  height: 48px;
  line-height: 48px;
}
.title {
  font-size: 20px;
  font-weight: 600;
}
</style>
