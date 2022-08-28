<template>
  <div class="arrow-wrap" :class="isClose ? 'close' : ''">
    <div class="arrow" @click="() => onClickCb()">
      <i></i>
      <i></i>
      <i></i>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { toRefs } from "vue"
interface Props {
  isClose: boolean,
  onClickCb: Function
}
const props = withDefaults(defineProps<Props>(), {
  isClose: false,
  onClickCb: () => {}
})
const { isClose, onClickCb } = toRefs(props)
</script>
<style lang="scss" scoped>
.arrow-wrap {
  z-index: 40;
  position: fixed;
  right: 0;
  top: 213px;
  cursor: pointer;
}

.arrow {
  width: 34px;
  height: 31px;
  padding: 10px;
  background: #222;
  position: relative;
}

.arrow i {
  display: block;
  width: 14px;
  height: 2px;
  background: #fff;
  position: absolute;
  border-radius: 10px 0 0 10px;
  transition: all 300ms;
}

.arrow i:nth-of-type(1) {
  top: 10;
}

.arrow i:nth-of-type(2) {
  top: 15px;
}

.arrow i:nth-of-type(3) {
  top: 20px;
}

.arrow:hover i {
  border-radius: 0;
}

.arrow:hover i:nth-of-type(1) {
  width: 8px;
  top: 15px;
  transform-origin: left center;
  transform: rotate(-45deg);
}

.arrow:hover i:nth-of-type(2) {
  border-radius: 10px 0 0 10px;
}

.arrow:hover i:nth-of-type(3) {
  width: 8px;
  top: 15px;
  transform-origin: left center;
  transform: rotate(45deg);
}

.close {
  .arrow i:nth-of-type(1) {
    width: 14px;
    top: 15px;
    transform-origin: center center;
    transform: rotate(-45deg);
  }

  .arrow i:nth-of-type(2) {
    display: none;
  }

  .arrow i:nth-of-type(3) {
    width: 14px;
    top: 15px;
    transform-origin: center center;
    transform: rotate(45deg);
  }
}
</style>