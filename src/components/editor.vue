<template>
  <md-editor v-model="text" />
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const text = ref<string>('');
    return {
      text 
    }
  }
});
</script>