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
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.bread-word {
  padding: 0 20px;
  line-height: 36px;
  background-color: #f0f0f0;
}
.title {
  padding: 0 20px;
  height: 48px;
  line-height: 48px;
}
.title {
  font-size: 18px;
  font-weight: 600;
}
</style>
