<template>
  <div id="verify-jigsaw">
    <a-modal v-model:visible="visible" :getContainer="getContainer" centered title="拖动下方滑块完成拼图" :footer="null"
      @cancel="handleClose">
      <div ref="checkwraps" class="check">
        <!-- 小块拼图 -->
        <div ref="checkchild" :class="['check-child', showTip ? 'anim-floatlr' : '']"></div>
        <div v-show="showSuccess" class="success-tips">
          <div class="success-icon">
            <svg-icon class="icon" icon-class="success"></svg-icon>
          </div>
          <div class="success-tipword">{{ useTime < 3 ? `只用了${useTime}s，简直比闪电还快` : '验证成功' }}</div>
        </div>
      </div>
      <div class="drag-wrap">
        <!-- 轨道 -->
        <div class="drag-track"></div>
        <!-- 滑块 -->
        <div ref="dragbtn" :class="['drag-btn', showTip ? 'anim-floatlr' : '']" @mousedown="handleMouseDown">
          <menu-outlined style="transform: rotate(90deg)" />
        </div>
      </div>
      <div class="bottom-btn">
        <div class="tips">
          <div v-show="showTip">请控制拼图块对齐缺口</div>
        </div>
        <div class="refresh-btn" @click="handleRefresh">
          <reload-outlined />
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { toRefs, ref, onMounted, computed } from 'vue'
import { MenuOutlined, ReloadOutlined } from "@ant-design/icons-vue";
interface Props {
  visible: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
})
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()
const { visible } = toRefs(props)
const showSuccess= ref<boolean>(false)
const clickDown = ref<boolean>(false)
const showTip = ref<boolean>(false)
const checkwraps = ref<HTMLDivElement | null>(null)
const checkchild = ref<HTMLDivElement | null>(null)
const dragbtn = ref<HTMLDivElement | null>(null)
const startX = ref<number>(0) // 记录鼠标down落点
const transX = ref<number>(0) // 记录鼠标move横移的距离
const randomLeft = ref<number>(0) // 获取随机位置left,top
const randomTop = ref<number>(0)
const startTime = ref<number>(0)
const endTime = ref<number>(0)
const useTime = computed(() => {
  const result = (endTime.value - startTime.value) / 1000
  return Number(result.toFixed(1))
})
const getContainer = () => {
  return document.getElementById('verify-jigsaw') // modal挂载到#verify-jigsaw
}
const initTop = computed(() => {
  return randomTop.value + 'px'
})
const initLeft = computed(() => {
  return randomLeft.value + 'px'
})
const initTopBox = computed(() => {
  return '-' + randomTop.value + 'px'
})
const initLeftBox = computed(() => {
  return '-' + randomLeft.value + 'px'
})
const getRandomLocation = () => {
  // 阴影部分给个随机位置, 且保持在容器里靠右侧的某范围内
  // 容器：宽472,高280。让阴影的left落在在110~410范围内，top落在20~200的范围内
  const left = Math.floor(Math.random() * (410 - 110 + 1) + 110)
  const top = Math.floor(Math.random() * (200 - 20 + 1) + 20)
  randomLeft.value = left
  randomTop.value = top
}
const setDragTrans = (ofs: number, isBack=false) => {
  if (dragbtn.value) {
    if(isBack) {
      dragbtn.value.style.transition = 'transform .5s'
      const timers = setTimeout(() => {
        clearTimeout(timers)
        if(dragbtn.value) {
          dragbtn.value.style.transition = ''
        }
      }, 500)
    }
    dragbtn.value.style.transform = `translateX(${transX.value}px)`
  }
  if (checkchild.value) {
    if(isBack) {
      checkchild.value.style.transition = 'transform .5s'
      const timer = setTimeout(() => {
        clearTimeout(timer)
        if (checkchild.value) {
          checkchild.value.style.transition = ''
        }
      }, 500)
    }
    checkchild.value.style.transform = `translateX(${transX.value + ofs}px)`
  }
}
const handleClose = () => {
  emit('update:visible', false)
}
const initTrans = 20 // dragbtn初始tranform偏移
const offsetWidth = 9 // dragbtn比小拼图宽18，为了居中对齐，小拼图多偏移的距离
const dragWidth = 70 // dragbtn的宽度
const handleMouseDown = (ev: MouseEvent) => {
  if(showSuccess.value) return
  clickDown.value = true
  startTime.value = new Date().getTime()
  startX.value = ev.pageX
  console.log(ev)
  document.onmousemove = (event: MouseEvent) => {
    if (!clickDown.value) return
    const { pageX } = event
    transX.value = initTrans + pageX - startX.value
    if (checkwraps.value && (transX.value < 0 || transX.value > (checkwraps.value.offsetWidth - dragWidth))) {
      return
    }
    setDragTrans(offsetWidth)
  }
  document.onmouseup = () => {
    if (!clickDown.value) return
    const offset = 20 // 前后误差20都算成功
    // 松手时，如果落在阴影左右误差范围内，就提示成功，否则失败
    // 即：阴影块的left - transX 误差小于 offset 就成功
    if((randomLeft.value - transX.value - offset <= 0) && (randomLeft.value - transX.value + offset >= 0)) {
      // 成功, 讲拼图与阴影对齐
      transX.value = randomLeft.value - offsetWidth
      setDragTrans(offsetWidth)
      // 出现成功提示，禁止点击滑动，3s后弹窗消失，回调emit通知验证成功
      showSuccess.value = true
      endTime.value = new Date().getTime()
      const sucTimer = setTimeout(() => {
        clearTimeout(sucTimer)
        handleClose()
      }, 1000)
    } else {
      // 失败：1.出失败提示，3s后消失。2.出动画，3s后还原，且回到初始位置。
      showTip.value = true
      const timer = setTimeout(() => {
        clearTimeout(timer)
        showTip.value = false
        transX.value = initTrans
        setDragTrans(offsetWidth, true)
      }, 3000)
    }
    clickDown.value = false
    document.onmousemove = null
    document.onmouseup = null
  }
}
const handleRefresh = () => {
  if(showSuccess.value) return
  // 树形图片和位置 初始化
}
onMounted(() => {
  getRandomLocation()
})
</script>
<style lang="scss" scoped>
.check {
  width: 472px;
  height: 280px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(https://img0.baidu.com/it/u=2028084904,3939052004&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500);
  position: relative;
}
.success-tips {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .success-icon {
    width: 60px;
    height: 60px;
    text-align: center;
    font-size: 60px;
    border-radius: 50%;
    background-color: #fff;
    .icon {
      display: block;
    }
  }
  .success-tipword {
    margin-top: 10px;
    color: #2cd000;
    font-size: 20px;
  }
}
/* 缺口 */
.check::before {
  content: '';
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #fff;
  position: absolute;
  left: v-bind(initLeft);
  top: v-bind(initTop);
}

/* 小块拼图 */
.check-child {
  content: '';
  width: 50px;
  height: 50px;
  border: 1px solid #fff;
  background-image: inherit;
  background-repeat: inherit;
  background-size: 472px 280px;
  /** 与容器背景大小要一致 **/
  background-position: v-bind(initLeftBox) v-bind(initTopBox);
  position: absolute;
  left: 0;
  top: v-bind(initTop);
  transform: translateX(29px);
  /** (70 - 52) / 2 + 20, 滑块按钮宽度减去小块拼图总宽度再除以2,再加滑块按钮的初始偏移 **/
}

.drag-wrap {
  position: relative;
  padding: 16px 0;
  margin-top: 10px;
}

/* 轨道 */
.drag-track {
  width: 100%;
  height: 18px;
  border-radius: 40px;
  background: #e4e4e4;
}

/* 滑块 */
.drag-btn {
  z-index: 10;
  position: absolute;
  top: 4px;
  left: 0;
  transform: translateX(20px);
  /** 初始偏移一点好看一点 **/
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 18px;
  width: 70px;
  background-color: rgb(26, 121, 255);
  box-shadow: rgba(26, 121, 255, .52) 0px 0px 10px 1px;
  border-radius: 40px;
  text-align: center;
  cursor: pointer;
}

.bottom-btn {
  display: flex;
  align-items: center;

}

.tips {
  flex: 1;
  margin-right: 10px;
  font-size: 16px;
  color: red;
}

.refresh-btn {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 28px;
  color: #999;
  cursor: pointer;
}

.anim-floatlr {
  animation: floatlr .25s ease 1s infinite alternate forwards;
}

@keyframes floatlr {
  from {
    left: 0px;
  }

  to {
    left: 5px;
  }
}
</style>