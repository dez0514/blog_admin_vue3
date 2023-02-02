<template>
  <div class="bread">
    <a-breadcrumb class="bread-word">
      <a-breadcrumb-item v-for="(item, index) in breadCrumbArr" :key="index">{{ item }}</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="title">
      <div>{{ route.meta && route.meta.title }}</div>
      <div class="key-box" @click="openSearchBar">
        <svg-icon class="icon search" icon-class="search"></svg-icon>
        <span class="key-style"><kbd>Ctrl K</kbd></span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import useSearch from './globalSearch/useSearch'
const { openSearchBar } = useSearch
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
  /* line-height: 48px; */
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.key-box {
  display: flex;
  align-items: center;
  margin-left: 16px;
  cursor: pointer;

  .key-style {
    margin-left: 10px;
    display: block;
    border: 1px solid rgba(60, 60, 67, .12);
    border-radius: 6px;
    font-weight: 500;
    padding: 0 6px;
    color: rgba(60, 60, 67, .7);
  }
  &:hover .key-style {
    border-color: #42b883;
    color: #42b883;
  }
}
</style>
