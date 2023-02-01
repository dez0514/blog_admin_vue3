<template>
  <div style="padding: 0 20px;">
    <div>home</div>
    <a-button type="primary" @click="test"> Primary</a-button>
    <a-alert message="好可惜，我也不会" type="success" />
    <div>{{ filter + '' + nextId }}</div>
    <div v-for="(item, index) in todos" :key="index">{{ item.text }}</div>
    <a-button type="primary" @click="handleChangeMeta">修改router.meta中的参数</a-button>
    <div>comments:{{ comments }}</div>
    <a-button type="primary" @click="getPageList">get page</a-button>
    <div>
      <div>global search test</div>
      <a-button type="primary" @click="testSearch">搜索框open</a-button>
      <a-button type="primary" style="margin-left: 5px;" @click="testSearch('close')">搜索框close</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
// import { onMounted } from 'vue'
// import { getData } from '../../api'
import { todoStore } from '../../store/pinia'
import { storeToRefs } from 'pinia'
import { getArticlesPage } from '../../api/articles'
import useSearch from '../../components/globalSearch/useSearch';
const { openSearchBar, closeSearchBar } = useSearch
const store = todoStore()
const { todos, filter, nextId, comments } = storeToRefs(store)

// 搜索框
const testSearch = (type: undefined | string) => {
  if(type === 'close') {
    closeSearchBar()
  } else {
    openSearchBar()
  }
}

const test = () => {
  console.log(store)
  store.addTodo('test1')
}
const handleChangeMeta = () => {
  store.updateComments(25)
  console.log(comments)
}
const getPageList = () => {
  const params = {
    pageSize: 10,
    pageNum: 1,
    type: 'archive',
    year: 2021,
    month: 9,
    tag: 'vue',
    keyword: 'or 1=1'
  }
  getArticlesPage(params).then((res: any) => {
    console.log('page===', res)
  })
}
</script>
<style lang="scss" scoped>
</style>
