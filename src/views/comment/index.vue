<template>
  <div class="comments">
    <div style="margin-bottom: 10px;">comments</div>
    <calendar />
  </div>
</template>
<script lang="ts" setup>
import calendar from '../../components/calendar/calendar.vue'
</script>
<style lang="scss" scoped>
.comments {
  padding: 0 20px;
}
</style>