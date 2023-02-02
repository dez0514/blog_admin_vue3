<template>
  <div class="global-search-wrapper" @click="handleClose">
    <div class="global-search-content" @click.stop>
      <div class="search-form-wrap">
        <form class="search-form">
          <label>
            <svg-icon v-show="showLoad" class="icon loading" icon-class="loading"></svg-icon>
            <svg-icon v-show="!showLoad" class="icon search" icon-class="search"></svg-icon>
          </label>
          <input ref="inputModel" v-model="keywords" class="search-input" type="text" @input="handleDebounceInput" @focus="onFocus" />
          <div v-show="showClear" class="clear-btn" @click="handleClear">
            <svg-icon class="icon clear" icon-class="clear"></svg-icon>
          </div>
        </form>
      </div>
      <div style="padding: 0 3px;">
        <div class="search-result">
          <div class="empty-keywords" v-show="!hideEmptyTip">No recent searches</div>
          <div class="empty-result" v-show="showNodata">
            <div class="nosearch-icon">
              <svg-icon class="icon nosearch" icon-class="nosearch"></svg-icon>
            </div>
            <div class="empty-tips">No results for "<strong>{{ keywords }}</strong>"</div>
            <p>Try searching for other keywords</p>
          </div>
          <div class="empty-keywords" style="cursor: pointer;" v-show="showErr" @click="handleRefresh">load error, click try again!</div>
          <div class="result-list" v-show="dataList.length > 0">
            <div class="result-item" v-for="(item, index) in dataList" :key="index">
              <div class="item-type">{{ item.type }}</div>
              <div class="item-inner" v-for="(inner, idx) in item.children" :key="`${index}_${idx}`" :aria-selected="lightIndex === `${index}_${idx}`" :ref="setRef" @mouseenter="(e) => handleMouseIn(index, idx, e)" @mousemove="(e) => handleMouseIn(index, idx, e)" @click="handleClickJump(inner)">
                <div class="inner-wrap">
                  <div>
                    <svg-icon v-if="index === 0 && idx === 0" class="icon hash" icon-class="hash"></svg-icon>
                    <svg-icon v-else class="icon menu" icon-class="menu"></svg-icon>
                  </div>
                  <div class="inner-box">
                    <div class="inner-desc">{{ inner.content }}</div>
                    <div class="inner-tag">{{ inner.tag }}</div>
                  </div>
                  <div class="icon-enter">
                    <svg-icon class="icon enter" icon-class="enter"></svg-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="search-bottom">
        <div class="key-wraps">
          <div class="key-box">
            <span class="key-style"><kbd>Esc</kbd></span>
            <span class="key-tip">to close</span>
          </div>
          <div class="key-box">
            <span class="key-style"><kbd>↑</kbd></span>
            <span class="key-style left-space"><kbd>↓</kbd></span>
            <span class="key-tip">to navigate</span>
          </div>
          <div class="key-box">
            <span class="key-style"><kbd>↵</kbd></span>
            <span class="key-tip">to select</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick } from 'process';
import { ref, computed, onUnmounted, onMounted } from 'vue'
import useSearch from './useSearch'
const { closeSearchBar } = useSearch
const keywords = ref<string>('')
const hideEmptyTip = ref<boolean>(false) // 显示No recent searches
const showLoad = ref<boolean>(false) // 显示加载小图标
const showNodata = ref<boolean>(false) // 显示无数据
const showErr = ref<boolean>(false) // 显示异常
const dataList = ref<any>([])
const lightIndex = ref<string>('') // `${index}_${idx}`
const showClear = computed(() => {
  return keywords.value !== ''
})
const inputModel = ref<any>(null);
const boxRefs = ref<any>([]);
const setRef = (el: any) => {
  if (el) {
    boxRefs.value.push(el);
  }
};
const onFocus = () => {
  if(dataList.value.length > 0) {
    // 聚焦第一个高亮
    lightIndex.value = '0_0'
  }
}
const handleClickJump = (inner: any) => {
  console.log(inner)
}
const handleMouseIn = (index: number, idx: number, e: any) => {
  // console.log(index, idx)
  lightIndex.value = `${index}_${idx}`
}
const handleClear = () => {
  keywords.value = ''
  dataList.value = []
  showNodata.value = false
  hideEmptyTip.value = false
  showErr.value = false
}
const debounce = (fn: Function, wait: number = 500) => {
  let timeout: any = null
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...arguments)
    }, wait)
  }
}
const getList = () => {
  showLoad.value = true
  try {
    setTimeout(() => {
      showLoad.value = false
      hideEmptyTip.value = true
      dataList.value = [
        {
          type: '最佳实践',
          children: [
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' }
          ]
        },
        {
          type: '最佳实践2',
          children: [
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' }
          ]
        },
        {
          type: '最佳实践3',
          children: [
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' },
            { content: 'content', tag: '标签', url: '' }
          ]
        }
      ]
      if(dataList.value.length === 0) {
        showNodata.value = true
      } else {
        showNodata.value = false
        lightIndex.value = '0_0'
      }
      // showErr.value = true
    }, 2000)
  } catch {
    dataList.value = []
    showLoad.value = false
    hideEmptyTip.value = false
    showErr.value = true
  }
}
const handleInput = (val: any) => {
  // console.log('val===', val.target.value)
  getList()
}
const handleDebounceInput = debounce(handleInput, 1000)
const handleRefresh = () => {
  showErr.value = false
  hideEmptyTip.value = false
  getList()
}
const handleClose = () => {
  closeSearchBar()
}
const moveLight = (keyType: string) => {
  if(lightIndex.value !== '' && dataList.value.length > 0) {
    // lightIndex.value
    console.log('lightIndex==', lightIndex.value)
    const [index, idx] = lightIndex.value.split('_').map(item => Number(item) || 0)
    console.log('init==', index, idx)
    let newIdx = 0
    let newIndex = 0
    if(keyType === 'up') {
      if(idx > 0) {
        newIdx = idx - 1
        newIndex = index
      } else if(idx === 0 && index > 0 && index < dataList.value.length) {
        newIndex = index - 1
        if(dataList.value[newIndex] && dataList.value[newIndex].children && dataList.value[newIndex].children.length > 0) {
          newIdx = dataList.value[newIndex].children.length - 1
        }
      } else if(idx === 0 && index === 0) {
        newIndex = dataList.value.length - 1
        newIdx = dataList.value[newIndex].children.length - 1
      }
    } else if(keyType === 'down') {
      if(dataList.value[index] && dataList.value[index].children && dataList.value[index].children.length > 0) {
        if(idx < dataList.value[index].children.length - 1) {
          newIdx = idx + 1
          newIndex = index
        } else if(idx === dataList.value[index].children.length - 1 && index < dataList.value.length - 1) {
          newIdx = 0
          newIndex = index + 1
        } else if(idx === dataList.value[index].children.length - 1 && index === dataList.value.length - 1) {
          newIdx = 0
          newIndex = 0
        }
      }
    }
    lightIndex.value = `${newIndex}_${newIdx}`
    // 获取高亮元素，让其进入可视区 element.scrollIntoView()
    const fidx = boxRefs.value.findIndex((item: any) => item.ariaSelected === 'true' || item.ariaSelected === true)
    if(fidx > -1) {
      boxRefs.value[fidx].scrollIntoView({ block: 'center', inline: 'center' })
    }
  }
}
const keyDownEvt = (e: any) => {
  // console.log('keydown==', e) // 38 up, 40 down
  if(e.keyCode === 38) {
    e.preventDefault() // 阻止浏览器默认动作
    moveLight('up')
  } else if(e.keyCode === 40) {
    e.preventDefault()
    moveLight('down')
  } else if(e.keyCode === 13) { // enter
    e.preventDefault()
    if(lightIndex.value !== '') {
      const [index, idx] = lightIndex.value.split('_').map(item => Number(item) || 0)
      if(dataList.value.length > 0 && dataList.value[index] && dataList.value[index].children && dataList.value[index].children.length > 0 && dataList.value[index].children[idx]) {
        const itemObj = dataList.value[index].children[idx]
        handleClickJump(itemObj)
      }
    }
  } else if(e.keyCode === 27) { // esc
    e.preventDefault()
    handleClose()
  }
}
onMounted(() => {
  window.addEventListener('keydown', keyDownEvt)
  nextTick(() => {
    inputModel.value?.focus()
  })
});
onUnmounted(() => {
  window.removeEventListener('keydown', keyDownEvt)
})
</script>
<style lang="scss" scoped>
.global-search-wrapper {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, .5);

  .global-search-content {
    margin: 60px auto auto;
    width: 560px;
    background: #f9f9f9;
    border-radius: 6px;
    box-shadow: inset 1px 1px 0 0 hsla(0, 0%, 100%, .5), 0 3px 8px 0 #555a64;
    animation: livein 1s ease forwards;
    transform: translateY(50px);
  }
}

.search-form-wrap {
  padding: 12px 12px 0;
}

.search-form {
  position: relative;
  margin: 0;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  box-shadow: none;
  height: 56px;
  width: 100%;
  background-color: #fff;
  border: 1px solid #42b883;

  .search-input {
    padding: 0 0 0 8px;
    font-size: 1.2em;
    appearance: none;
    outline: none;
    color: #213547;
    background: transparent;
    height: 100%;
    border: 0;
    flex: 1;
  }

  .icon.search {
    font-size: 24px;
    color: #42b883;
  }
  .icon.loading {
    font-size: 26px;
    color: #42b883;
    animation: rotateload 2s linear infinite;
  }

  .clear-btn {
    padding: 6px;
    cursor: pointer;

    .icon {
      font-size: 16px;
      color: #223648;
    }

    &:hover .icon {
      color: #42b883;
    }
  }

}

.search-result {
  padding: 0 12px;
  min-height: 12px;
  max-height: 488px;
  overflow: hidden;
  overflow-y: auto;
  overflow-y: overlay;

  .empty-keywords {
    margin: 0 auto;
    padding: 36px 0;
    width: 80%;
    text-align: center;
    font-size: .9em;
    user-select: none;
    color: rgba(60, 60, 60, .7);
  }
  .empty-result {
    font-size: .9em;
    margin: 0 auto;
    padding: 36px 0;
    text-align: center;
    width: 80%;
    color: rgba(60, 60, 60, .7);
    .nosearch-icon {
      font-size: 40px;
      text-align: left;
      padding-bottom: 12px;
      .icon {
        display: block;
      }
    }
    .empty-tips {
      font-size: 1.2em;
    }
  }
}
.result-list {
  padding-bottom: 36px;
}
.item-type {
  background: #f9f9f9;
  color: #42b883;
  font-size: .85em;
  font-weight: 600;
  line-height: 32px;
  margin: 0 -4px;
  padding: 8px 4px 0;
  position: sticky;
  top: 0;
  z-index: 10;
}
.item-inner {
  position: relative;
  border-radius: 4px;
  padding-bottom: 4px;
  width: 100%;
  cursor: pointer;
  .inner-wrap {
    display: flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 1px 3px 0 #d4d9e1;
    .icon {
      font-size: 20px;
      color: rgba(60, 60, 60, .7);
    }
  }
  .inner-box {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    font-weight: 500;
    justify-content: center;
    line-height: 1.2em;
    margin: 0 8px;
    overflow-x: hidden;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 80%;
    .inner-desc {
      font-size: .9em;
    }
    .inner-tag {
      color: rgba(60, 60, 60, .7);
      font-size: .75em;
    }
  }
  .icon-enter {
    display: none;
  }
}
.item-inner[aria-selected="true"] {
  color: #fff;
  .inner-wrap {
    background-color: #42b883;
  }
  .icon-enter {
    display: block;
  }
  .icon, .inner-tag {
    color: #fff;
  }
}
.search-bottom {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 44px;
  width: 100%;
  background: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 -1px 0 0 #e0e3e8, 0 -3px 6px 0 rgba(69, 98, 155, .12);
  user-select: none;
  .key-wraps {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .key-box {
    display: flex;
    align-items: center;
    margin-right: 16px;

    .key-style {
      display: block;
      border: 1px solid rgba(60, 60, 67, .12);
      border-radius: 6px;
      font-weight: 500;
      padding: 0 6px;
      color: rgba(60, 60, 67, .7);
      &.left-space {
        margin-left: 5px;
      }
    }

    .key-tip {
      display: block;
      margin-left: 10px;
      color: rgba(60, 60, 67, .7);
    }
  }
}
@keyframes rotateload {
  0%{ transform:rotate(0deg); }
	50%{ transform:rotate(180deg); }
	100%{ transform:rotate(360deg); }
}
@keyframes livein {
  from{ transform: translateY(50px); }
	to{ transform: translateY(0px); }
}
// 滚动条轨道
:deep(::-webkit-scrollbar-track) {
  background-color: transparent;
  padding: 0 3px;
}

:deep(::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #747474;
}
</style>