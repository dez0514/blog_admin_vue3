<template>
  <div class="global-search-wrapper" @click="handleClose">
    <div class="global-search-content" @click.stop>
      <div class="search-form-wrap">
        <form class="search-form">
          <label>
            <svg-icon v-show="showLoad" class="icon loading" icon-class="loading"></svg-icon>
            <svg-icon v-show="!showLoad" class="icon search" icon-class="search"></svg-icon>
          </label>
          <input v-model="keywords" class="search-input" type="text" @input="handleDebounceInput" />
          <div v-show="showClear" class="clear-btn" @click="handleClear">
            <svg-icon class="icon clear" icon-class="clear"></svg-icon>
          </div>
        </form>
      </div>
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
          <div v-for="(item, index) in dataList" :key="index">
            <div>title</div>
            <div>item</div>
          </div>
        </div>
      </div>
      <div class="search-bottom">
        <div class="key-box">
          <span class="key-style"><kbd>Esc</kbd></span>
          <span class="key-tip">to close</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import useSearch from './useSearch'
const { closeSearchBar } = useSearch
const keywords = ref<string>('')
const hideEmptyTip = ref<boolean>(false) // 显示No recent searches
const showLoad = ref<boolean>(false) // 显示加载小图标
const showNodata = ref<boolean>(false) // 显示无数据
const showErr = ref<boolean>(false) // 显示异常
const dataList = ref<any>([])
const showClear = computed(() => {
  return keywords.value !== ''
})
const handleClear = () => {
  keywords.value = ''
  dataList.value = []
  showNodata.value = false
  hideEmptyTip.value = false
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
      dataList.value = []
      // if(dataList.value.length === 0) {
      //   showNodata.value = true
      // } else {
      //   showNodata.value = false
      // }
      showErr.value = true
    }, 5000)
  } catch {
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

.search-bottom {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 0 12px;
  height: 44px;
  width: 100%;
  background: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 -1px 0 0 #e0e3e8, 0 -3px 6px 0 rgba(69, 98, 155, .12);
  user-select: none;

  .key-box {
    display: flex;
    align-items: center;

    .key-style {
      display: block;
      border: 1px solid rgba(60, 60, 67, .12);
      border-radius: 6px;
      font-weight: 500;
      padding: 0 6px;
      color: rgba(60, 60, 67, .7);
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
</style>