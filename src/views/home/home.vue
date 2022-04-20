<script setup lang="ts">
import { todoStore } from '../../store/pinia'
import { storeToRefs } from 'pinia'
// import { getData } from '../../api'
const store = todoStore()
const { todos,filter,nextId,comments } = storeToRefs(store)
const test = () => {
    console.log(store)
    store.addTodo('test1')
}
const handleChangeMeta = () => {
  store.updateComments(25)
  console.log(comments)
}
</script>
<template>
    <div>home</div>
    <a-button type="primary" @click="test"> Primary</a-button>
    <a-alert message="好可惜，我也不会" type="success" />
    <div>{{filter + '' + nextId}}</div>
    <div v-for="(item,index) in todos" :key="index">{{item.text}}</div>
    <a-button type="primary" @click="handleChangeMeta">修改router.meta中的参数</a-button>
    <div>comments:{{comments}}</div>
</template>
<style lang="scss" scoped>

</style>
