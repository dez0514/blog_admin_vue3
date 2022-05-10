<template>
  <div class="preview-image" @mouseup.prevent="handleMouseEnd">
    <img class="preview-pic" 
      ref="previewPic" 
      :src="curSrc"
      @wheel="handleWheelScale"
      @mousedown.prevent="handleMouseDown"
      @mousemove.prevent="handleMouseMove"
      alt=""
    />
    <div class="preview-btns">
      <div class="btn" title="放大" @click="handleZoomOut"><zoom-in-outlined /></div>
      <div class="btn" title="缩小" @click="handleZoomIn"><zoom-out-outlined /></div>
      <div class="btn" title="重置" @click="handleReset"><rollback-outlined /></div>
      <div class="btn" title="向左旋转90°" @click="handleRotate('left')"><undo-outlined /></div>
      <div class="btn" title="向右旋转90°" @click="handleRotate('right')"><redo-outlined /></div>
      <div class="btn" title="下载图片" @click="handleDownload" v-show="showDownLoadBtn"><vertical-align-bottom-outlined /></div>
    </div>
    <div class="slide-btns left" title="上一张" :class="srcIndex === 0 ? 'stop_click' : ''" v-show="piclist.length > 1" @click="handleToPrev">
      <left-circle-outlined />
    </div>
    <div class="slide-btns right" title="下一张" :class="srcIndex === piclist.length - 1 ? 'stop_click' : ''" v-show="piclist.length > 1" @click="handleToNext">
      <right-circle-outlined />
    </div>
    <div class="preview-close" title="关闭" @click="handleClose"><close-outlined /></div>
  </div>
</template>
<script setup lang="ts">
import { ZoomInOutlined, ZoomOutOutlined, RollbackOutlined, VerticalAlignBottomOutlined,
CloseOutlined, RightCircleOutlined, LeftCircleOutlined, RedoOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { ref, reactive, computed } from "vue"
const props = defineProps<{
  piclist: string[],
  viewIndex: number,
  downloadnames: string[],
  onClose: Function
}>()
const srcIndex = ref<number>(props.viewIndex)
const curSrc = computed(() => (props.piclist as any)[srcIndex.value])
const showDownLoadBtn = computed(() => {
  let isShow = false
  let temp = props.downloadnames.slice()
  if(temp.length < props.piclist.length) {
    const num = props.piclist.length - temp.length
    const arr = new Array(num).fill('')
    temp = temp.concat(arr)
  }
  // 先保持长度一样，不够就补空
  if(!!(temp as any)[srcIndex.value]) {
    // 当前查看的这个存在值，则可以下载
    isShow = true
  } else {
    isShow = false
  }
  return isShow
})
const previewPic = ref<HTMLImageElement | null>(null)
const scale = ref<number>(1)
const isMoving = ref<boolean>(false)
const distance =  reactive({
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  translateX: 0,
  translateY: 0,
  rotate: 0
})
const handleZoomOut = () => {
  // 小数会出现不准确的情况，先换整数加减再还原回小数
  scale.value = Number(((scale.value * 10 + 1) / 10).toFixed(1))
  setImagStyle()
}
const handleZoomIn = () => {
  scale.value = Number(((scale.value * 10 - 1) / 10).toFixed(1))
  scale.value = scale.value <= 0.4 ? 0.4 : scale.value
  // console.log('scale.value==', scale.value)
  setImagStyle()
}
const handleReset = () => {
  scale.value = 1
  distance.startX = 0
  distance.startY = 0
  distance.endX = 0
  distance.endY = 0
  distance.translateX = 0
  distance.translateY = 0
  distance.rotate = 0
  setImagStyle()
}
const handleWheelScale = ($event: any) => { // WheelEvent 提示：不存在wheelDelta
  if ($event.wheelDelta > 0) {
    handleZoomOut()
  } else {
    handleZoomIn()
  }
}
const handleMouseDown = ($event: MouseEvent) => {
  isMoving.value = true
  distance.startX = $event.pageX
  distance.startY = $event.pageY
}
const handleMouseMove = ($event: MouseEvent) => {
  if(isMoving.value) {
    distance.translateX = distance.endX + $event.pageX - distance.startX
    distance.translateY = distance.endY + $event.pageY - distance.startY
    setImagStyle()
  }
}
const handleMouseEnd = () => {
  isMoving.value = false
  distance.endX = distance.translateX
  distance.endY = distance.translateY
}
const handleRotate = (type: string) => {
  if (type === 'right') {
    distance.rotate = (distance.rotate + 90) >= 360 ? distance.rotate + 90 - 360  : distance.rotate + 90
  } else if (type === 'left') {
    distance.rotate = (distance.rotate - 90) <= -360 ? distance.rotate - 90 + 360  : distance.rotate - 90
  }
  console.log('rotate===', distance.rotate)
  setImagStyle()
}
const setImagStyle = () => {
  if (previewPic.value) {
    previewPic.value.style.transform = `scale(${scale.value}) translate(${distance.translateX}px, ${distance.translateY}px) rotate(${distance.rotate}deg)`
  }
}
const handleToPrev = () => {
  if (srcIndex.value <= 0) return
  handleReset()
  srcIndex.value--
}
const handleToNext = () => {
  if (srcIndex.value >= props.piclist.length - 1) return
  handleReset()
  srcIndex.value++
}
// 从地址获取文件名匹配有点麻烦，且可能存在不想用文件名做下载时的文件名，直接利用传参控制
const getFileNameByIndex = (index: number) => {
  let filename = ''
  if(props.downloadnames.length > 0 && index <= props.downloadnames.length - 1) {
    filename = props.downloadnames[index]
  }
  return filename
}
const handleDownload = () => {
  fetch(curSrc.value).then(res => res.blob()).then(blob => {
    const href = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = href
    a.download = getFileNameByIndex(srcIndex.value)
    a.click()
  })
}
const handleClose = () => {
  props.onClose()
}
</script>

<style lang="scss" scoped>
.preview-image {
  z-index: 2000;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, .4);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .preview-pic {
    max-width: 100%;
    max-height: 100%;
    user-select: none;
  }

  .preview-btns {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 20px;
    height: 40px;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, .6);

    .btn {
      padding: 0 5px;
      color: #fff;
      font-size: 22px;
      cursor: pointer;
    }
  }
  .slide-btns {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 30px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, .6);
    color: #fff;
    cursor: pointer;
    &.left {
      left: 30px;
    }
    &.right {
      right: 30px;
    }
    &.stop_click {
      opacity: 0.5;
    }
  }
  .preview-close {
    position: absolute;
    bottom: 30px;
    right: 30px;
    height: 60px;
    width: 60px;
    background: rgba(0, 0, 0, .6);
    color: #fff;
    font-size: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
}
</style>

