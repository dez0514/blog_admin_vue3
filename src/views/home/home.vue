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
  </div>
</template>
<script setup lang="ts">
// import { onMounted } from 'vue'
import { todoStore } from '../../store/pinia'
import { storeToRefs } from 'pinia'
import { getArticlesPage } from '../../api/articles'
// import { getData } from '../../api'
const store = todoStore()
const { todos, filter, nextId, comments } = storeToRefs(store)
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
    pageSize: 1,
    pageNum: 1,
    type: 1,
    tag: 'vue'
  }
  getArticlesPage(params).then((res: any) => {
    console.log('page===', res)
  })
}
</script>
<style lang="scss" scoped>
</style>
