<template>
  <div class="detail-page">
    <!-- <div class="show_menu_btn">目录</div> -->
    <a-tooltip placement="left" :visible="!isShowMenu && detailMenuList.length > 0">
      <template #title>
        <span>文章目录</span>
      </template>
      <fixbtn v-if="detailMenuList.length > 0" :is-close="isShowMenu" :on-click-cb="fixbtnClick"></fixbtn>
    </a-tooltip>
    <div class="menu-wrap" v-show="isShowMenu">
      <div class="menu-title">目录</div>
      <div class="menu-list">
        <div v-for="(item,index) in detailMenuList" :key="index" :class="['menu-item', activeMenuIndex === index ? 'active':'']" @click="handleClickMenu(index)">
          <a :href="`#heading${item.hrefIndex}`" :class="item.nodeName">{{ item.text }}</a>
        </div>
      </div>
    </div>
    <div class="title">{{ detailInfo && detailInfo.title }}</div>
    <div class="extra_info">
      <div class="extra-box">{{ detailInfo && detailInfo.extra_title }}</div>
      <a-divider type="vertical" />
      <div class="extra-box">{{ detailInfo && detailInfo.tags }}</div>
      <a-divider type="vertical" />
      <div class="extra-box">
        {{ (detailInfo && detailInfo.update_time) ?
        `更新时间：${detailInfo.update_time}` : 
        (detailInfo && detailInfo.create_time) ? 
        `创建时间：${detailInfo && detailInfo.create_time }` : '' }}
      </div>
    </div>
    <div class="gitlink" v-show="detailInfo && detailInfo.git">
      <p>git链接: <a :href="detailInfo && detailInfo.git" target="_blank">{{ detailInfo && detailInfo.git }}</a></p>
    </div>
    <div class="banner-wrap" v-show="detailInfo && detailInfo.banner">
      <div class="banner" :style="{ background: `url(${detailInfo && detailInfo.banner}) no-repeat`, backgroundPosition: 'center center', backgroundSize: 'cover' }"></div>
      <img :src="detailInfo && detailInfo.banner" alt="">
    </div>
    <div class="detail-desc md-container">
      <div ref="detailbox" v-html="detailInfo && detailInfo.content"></div>
    </div>
    <div v-show="curScrollTop > 30" class="to_top" @click="handleToTop">
     <svg-icon class="icon" icon-class="rocket"></svg-icon>
    </div>
    <!-- 局部loading -->
    <partload :load-state="loadState" @refresh="handleRefresh" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from "vue"
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue';
import { getArticleDetail } from '../../api/articles'
import { formartMd, getMdTitleList, MdTitle } from '../../utils/marked'
import fixbtn from "../../components/fixbtn.vue";
import partload from '../../components/partialLoad.vue'
import { emitter } from '../../utils/useEmit'
import { setScrollTop } from '../../utils/dom'
const route = useRoute()
const isShowMenu = ref<boolean>(false)
const detailInfo = ref<any>(null)
const detailMenuList = ref<MdTitle[]>([])
const activeMenuIndex = ref<number>(0)
const loadState = ref<number>(-1)
const detailbox = ref(null as HTMLDivElement | null)
const curScrollTop = ref<number>(0)
const fixbtnClick = () => {
  isShowMenu.value = !isShowMenu.value
  console.log('isShowMenu.value==', isShowMenu.value)
}

const getArticleById = (id: string | string[]) => {
  loadState.value = 0
  getArticleDetail({ id }, { isLoading: false }).then((res: any) => {
    console.log('detail===', res)
    if (res.code === 0) {
      if(Object.keys(res.data).length === 0) {
        loadState.value = 1
        return
      }
      loadState.value = -1
      const content = formartMd(res.data.content)
      // console.log('format====', content)
      detailInfo.value = { ...res.data, content }
      nextTick(() => {
        if (detailbox.value) {
          detailMenuList.value = getMdTitleList(detailbox.value)
          console.log('detailMenuList===', detailMenuList.value)
          const mdDomId = window.location.hash // 锚点就是hash值
          if (mdDomId) {
            const headerId = mdDomId.slice(1) // 去掉 #
            const hDom = document.getElementById(headerId)
            if (hDom) { // 如果找到锚点对应的元素 就把他滚到最顶部
              hDom.scrollIntoView(true)
              const index = detailMenuList.value.findIndex((item: any) => item.id === headerId)
              if (index > -1) {
                activeMenuIndex.value = index
              }
            }
          }
        }
      })
    } else if (typeof res.message === 'object') {
      loadState.value = 2
      message.error(res.message && res.message.sqlMessage)
    } else {
      loadState.value = 2
      message.error(res.message)
    }
  }).catch(() => {
    loadState.value = 2
  })
}
const handleClickMenu = (index: number) => {
  if (activeMenuIndex.value === index) return
  activeMenuIndex.value = index
}
const handleRefresh = () => {
  getArticleById(route.params.id)
}
const pageScrollCallback = (dom: HTMLDivElement) => {
  // dom 其实就是 .main
  curScrollTop.value = dom.scrollTop // 记录一下滚动距离
  // .main卷起部分的高度 与 detailMenuList中哪条的scrollTop接近，就哪个高亮
  // 依次取差值的绝对值，找出最小值
  const temp = detailMenuList.value.map((item:any) => Math.abs(item.scrollTop - dom.scrollTop))
  // 找出最小值,找出最小值那条对应的索引，即为应该高亮得那条
  const min = Math.min(...temp)
  const index = temp.findIndex((item:number) => item === min)
  activeMenuIndex.value = index
  // 当窗口内容已经滚动到最顶部时，可能存在情况：距离页面最下面的一个/几个的标题的距离 小于 距离上一个卷起的标题的距离，此时下面的标题都无法高亮了。
  // 与文章内容相关，无法解决所有情况，当滚动到底是让最后一个标题高亮
  if (dom.clientHeight + dom.scrollTop + 30 >= dom.scrollHeight) { // 距离最底部小于等于30px了
    activeMenuIndex.value = detailMenuList.value.length - 1 // 让最后menu一个高亮
  }
}
const handleToTop = () => {
  const container = document.getElementsByClassName('main')[0]
  setScrollTop(0, { container, animate: true, duration: 500 })
}
onMounted(() => {
  // 布局原因，监听页面滚动在main.vue里，滚动回调触发此事件。
  emitter.on('pageScrollCallback', pageScrollCallback)
  if (route.params.id) {
    getArticleById(route.params.id)
  }
})
onUnmounted(() => {
  emitter.off('pageScrollCallback', pageScrollCallback)
})
</script>
<style lang="scss" scoped>
.detail-page {
  padding: 0 20px;
}
.menu-wrap {
  box-sizing: border-box;
  padding: 5px 15px 20px;
  z-index: 30;
  position: fixed;
  right: 0;
  top: 210px;
  overflow: hidden;
  width: 240px;
  background: rgba(255,255,255,.65);
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
  .menu-title {
    line-height: 31px;
    border-bottom: 1px solid #aaa;
  }
  .menu-list {
    margin-top: 5px;
    max-height: 500px;
    overflow: hidden;
    overflow-y: auto;
    .menu-item a {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #000;
      &.h1, &.h2 {
        font-size: 16px;
      }
      &.h3 {
        font-size: 14px;
        padding-left: 14px;
      }
    }
    .menu-item.active a {
      color: #20a0ff;
    }
  }
}
.extra_info {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 50px;
  .extra-box {
    margin: 0 5px;
  }
}
.title {
  text-align: center;
  font-size: 24px;
}
.gitlink {
  border-left: 4px solid #20a0ff;
  background: #f0f2f7;
  color: #555;
  font-size: 1em;
  padding: 10px 20px;
  border-radius: 5px;
  a {
    padding-bottom: 1px;
    border-bottom: 1px solid rgba(0, 154, 97, 0.25);
  }
  a:hover {
    border-bottom: 1px solid #20a0ff;
  }
}
.banner-wrap {
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  border-radius: 10px;
  img {
    z-index: 10;
    position: absolute;
    right: 50px;
    top: 50%;
    transform: translateY(-50%);
    display: block;
    max-width: 200px;
    max-height: 200px;
  }
}
.banner {
  overflow: hidden;
  height: 350px;
  width: 100%;
  background-color: #f0f2f7;
  filter:blur(15px);
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(31, 45, 61, 0.2);
    filter: brightness(50%);
  }
}
.detail-desc {
  margin-top: 20px;
}
.to_top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  cursor: pointer;
  .icon {
    font-size: 45px;
    color: #000;
  }
}
</style>