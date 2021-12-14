<script setup lang="ts">
import { Button } from "ant-design-vue";
const test = () => {
    console.log('1111')
}
</script>
<template>
    <div>home</div>
    <Button type="primary" @click="test"> Primary</Button>
</template>
<style lang="scss" scoped>

</style>
