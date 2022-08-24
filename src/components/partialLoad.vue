<template>
  <div :class="['partial-loading', loadState === 0 ? 'loading' : '']" v-if="loadState > -1">
    <div class="load" v-if="loadState === 0">
      <a-spin size="large" />
    </div>
    <div class="nodata" v-if="loadState === 1">
      没有找到数据
    </div>
    <div class="err" v-if="loadState === 2" @click="handleRefresh" style="cursor: pointer;">
      加载异常，点击重试
    </div>
  </div>
</template>
<script lang="ts" setup>
import { toRefs } from "vue"
const emit = defineEmits<{ (e: "refresh"): void }>()
interface Props {
  loadState: number
}
const props = withDefaults(defineProps<Props>(), {
  loadState: -1
})
const { loadState } = toRefs(props)
const handleRefresh = () => {
  // emit refresh
  emit('refresh')
}
</script>
<style lang="scss" scoped>
.partial-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  &.loading {
    background: rgba(255, 255, 255, .7);
  }
  .load,.err,.nodata {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    text-align: center;
    width: 100%;
  }
}
</style>