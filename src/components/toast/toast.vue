<template>
  <div class="custom-toast-wrap" :style="toastStyle">
    <div class="toast-content">{{ message }}</div>
  </div>
</template>
<script lang="ts" setup>
import { toRefs, computed, CSSProperties } from 'vue';
type POSITION = 'top' | 'middle' | 'bottom'
interface Props {
  message: string;
  position?: POSITION;
  color?: string;
  bgColor?: string;
}
const props = withDefaults(defineProps<Props>(), {
  message: '',
  position: 'bottom',
  color: '#fff',
  bgColor: 'rgba(0,0,0,.8)'
})
const { message, position, color, bgColor } = toRefs(props)
const toastStyle = computed<CSSProperties>(() => {
  const top = position.value === 'top' ? '80px' : position.value === 'middle' ? '50%' : ''
  const bottom = '80px'
  const styleObj: CSSProperties = {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    background: bgColor.value,
    boxShadow: `0 3px 5px -1px ${bgColor.value}`,
    color: color.value
  }
  if(top) {
    styleObj.top = top
    if(position.value === 'middle') {
      styleObj.transform = 'translate(-50%, -50%)'
    }
  } else {
    styleObj.bottom = bottom
  }
  return styleObj
})
</script>
<style lang="scss" scoped>
.custom-toast-wrap {
  z-index: 999;
  overflow: hidden;
  position: fixed;
  background: rgba(0,0,0,.8);
  color: #fff;
  border-radius: 7px;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.8);
  .toast-content {
    padding: 6px 16px;
  }
}
/* .fade-anim {
  animation: fadeout 0.5s ease-out;
}
@keyframes fadeout {
  from { opacity: 1; }
  to { opacity: 0; }
} */
</style>