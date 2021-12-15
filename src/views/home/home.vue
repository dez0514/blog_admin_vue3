<script setup lang="ts">
const test = () => {
    console.log('1111')
}
</script>
<template>
    <div>home</div>
    <a-button type="primary" @click="test"> Primary</a-button>
    <a-alert message="好可惜，我也不会" type="success" />
</template>
<style lang="scss" scoped>

</style>
