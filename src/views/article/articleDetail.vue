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
      <div>目录</div>
      <div class="menu-list">
        <div v-for="(item,index) in detailMenuList" :key="index">
          <a :href="`#${item.id}`" :class="item.nodeName">{{ item.text }}</a>
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
        (detailInfo && detailInfo.update_time) ? 
        `创建时间：${detailInfo && detailInfo.create_time}` : '' }}
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
    <!-- 局部loading -->
    <partload :load-state="loadState" @refresh="handleRefresh" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue"
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue';
import { getArticleDetail } from '../../api/articles'
import { formartMd, getMdTitleList } from '../../utils/marked'
import fixbtn from "../../components/fixbtn.vue";
import partload from '../../components/partialLoad.vue'
const route = useRoute()
const isShowMenu = ref<boolean>(false)
const detailInfo = ref<any>(null)
const detailMenuList = ref<any>([])
const loadState = ref<number>(-1)
const detailbox = ref(null as HTMLDivElement | null)
const fixbtnClick = () => {
  isShowMenu.value = !isShowMenu.value
  console.log('isShowMenu.value==', isShowMenu.value)
}
const getArticleById = (id: string | string[]) => {
  loadState.value = 0
  getArticleDetail({ id }, { isLoading: false }).then((res: any) => {
    console.log(res)
    if (res.code === 0) {
      loadState.value = -1
      const content = formartMd(res.data.content)
      console.log('format====', content)
      detailInfo.value = { ...res.data, content }
      nextTick(() => {
        if (detailbox.value) {
          detailMenuList.value = getMdTitleList(detailbox.value)
          const list = 
          console.log('detailMenuList===', detailMenuList.value)
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
const handleRefresh = () => {
  getArticleById(route.params.id)
}
onMounted(() => {
  if (route.params.id) {
    getArticleById(route.params.id)
  }
})
</script>
<style lang="scss" scoped>
.detail-page {
  padding: 0 20px;
}
.menu-wrap {
  z-index: 30;
  position: fixed;
  right: 0;
  top: 210px;
  overflow: hidden;
  border: 1px solid red;
  width: 240px;
  height: 400px;
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
</style>