<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = defineProps({
  prefix: { type: String, default: 'icon' },
  iconClass: { type: String, required: true },
  color: { type: String, default: '' }
})
const { prefix, iconClass, color } = toRefs(props)
const symbolId = computed(() => `#${prefix.value}-${iconClass.value}`);
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
  fill: currentColor;
}
</style>
