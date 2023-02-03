<template>
  <div class="drag-verify-wrap">
    <div class="drag_bg" :style="{ width: `${dragWidth}px` }">
      <span v-show="sucLock">验证通过</span>
    </div>
    <div class="drag_text" onselectstart="return false;" unselectable="on">
      <span v-show="randomWidth === 0">拖动滑块验证</span>
    </div>
    <button
      type="button"
      class="handler handler_bg"
      @mousedown="mousedownFn($event)"
      @mousemove="mousemoveFn($event)"
      @mouseup="mouseupFn"
      :style="{ left: `${dragWidth}px` }"
    >
      <double-right-outlined v-show="!sucLock" style="margin-top: 10px"/>
      <check-circle-outlined
        v-show="sucLock"
        style="font-size: 22px;background-color: #7ac23c;color: #fff;border-radius: 50%;margin-top: 10px"
      />
    </button>
    <div class="drag-sign" :style="{ left: `${randomWidth}px` }">
      <safety-outlined v-show="randomWidth > 0" style="font-size: 22px;margin-top: 10px" />
    </div>
    <div class="tips" v-show="randomWidth > 0 && !sucLock" :style="{ right: `${312 - (110 - 46) - randomWidth}px` }">拖到绿色区域内</div>
  </div>
</template>
<script setup lang="ts">
import { DoubleRightOutlined, SafetyOutlined, CheckCircleOutlined } from "@ant-design/icons-vue";
import { ref, onMounted } from 'vue';
export interface API {
  refreshInit: Function;
}
const emit = defineEmits<{ (e: "emitVerifyDrag", flag: boolean): void }>();
const randomWidth = ref<number>(0);
const dragWidth = ref<number>(0);
const startX = ref<number>(0);
const mouseClickDown = ref<boolean>(false)
const sucLock = ref<boolean>(false)
const randomNum = (min: number = 100, max: number = 312) => {
  return Math.floor(Math.random() * (max - min) + min)
}
const mousedownFn = (e: MouseEvent) => {
  if (!sucLock.value) {
    mouseClickDown.value = true
    startX.value = e.clientX
    if (randomWidth.value === 0) {
      randomWidth.value = randomNum()
    }
  }
}
const mousemoveFn = (e: MouseEvent) => {
  if (mouseClickDown.value) {
    if(e.clientX < startX.value) {
      dragWidth.value = 0
      return
    }
    if(e.clientX - startX.value > 312) {
      dragWidth.value = 312
      return
    }
    dragWidth.value = e.clientX - startX.value
  }
}
const refreshInit = () => {
  randomWidth.value = 0
  dragWidth.value = 0
  startX.value = 0
  mouseClickDown.value = false
  sucLock.value = false
  emit('emitVerifyDrag', false)
}
defineExpose({
  refreshInit
})
const mouseupFn = () => {
  mouseClickDown.value = false
  if (randomWidth.value > 0 && dragWidth.value >= randomWidth.value - 10 && dragWidth.value <= randomWidth.value + 10) {
    // 前后误差10px
    dragWidth.value = randomWidth.value
    sucLock.value = true
    emit('emitVerifyDrag', sucLock.value)
  } else {
    dragWidth.value = 0
  }
}
onMounted(() => {
  document.body.addEventListener('mousemove', (e: MouseEvent) => {
    mousemoveFn(e)
  })
  document.body.addEventListener('mouseup', () => {
    mouseupFn()
  })
})

</script>
<style lang="scss" scoped>
.drag-verify-wrap {
  position: relative;
  background-color: #e8e8e8;
  width: 358px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  border-radius: 0;
  user-select: none;
}
.drag_bg {
  background-color: #7ac23c;
  color: #fff;
  height: 44px;
  width: 0px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  overflow: hidden;
}
.drag_text {
  position: absolute;
  top: 0px;
  width: 100%;
  user-select: none;
  font-size: 12px;
  color: #333;
}
.handler {
  position: absolute;
  top: -1px;
  left: 0px;
  width: 46px;
  height: 46px;
  border: 1px solid #e3e9e7;
  background: #fff;
  color: #999;
  cursor: move;
  border-radius: 0;
  z-index: 2;
}
.handler:focus {
  outline: 1px solid #8eb1ec;
}
.drag-sign {
  z-index: 1;
  position: absolute;
  top: -1px;
  border: 1px solid #cccccc;
  width: 46px;
  height: 46px;
  border-radius: 1px;
  background: #7ac23c;
  color: #fff;
  box-shadow: 0 0 10px inset #21a922;
  display: block;
}
.tips {
  z-index: 5;
  position: absolute;
  bottom: -40px;
  padding: 5px;
  border: 1px solid #ddd;
  background-color: #fff;
  line-height: 1.5;
  box-shadow: 1px 1.73px 3px 0 rgb(0 0 0 / 10%);
  color: #333;
}
.tips:before {
  font-size: 0;
  position: absolute;
  width: 0;
  height: 0;
  content: "";
  border: 6px dashed transparent;
  bottom: 100%;
  left: 10px;
  right: inherit;
  margin-bottom: -1px;
  border-bottom-style: solid;
  margin-left: -6px;
  border-bottom-color: #ddd;
}
.tips:after {
  font-size: 0;
  position: absolute;
  width: 0;
  height: 0;
  content: "";
  border: 5px dashed transparent;
  bottom: 100%;
  left: 10px;
  right: inherit;
  margin-bottom: -1px;
  border-bottom-style: solid;
  margin-left: -5px;
  border-bottom-color: #fff;
}
</style>