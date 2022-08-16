<template>
  <div class="detail-page">
    <div class="title">{{ detailInfo && detailInfo.title }}</div>
    <div class="extra_info">
      <div class="extra-box">{{ detailInfo && detailInfo.extra_title }}</div>
      <a-divider type="vertical" />
      <div class="extra-box">{{ detailInfo && detailInfo.tags }}</div>
      <a-divider type="vertical" />
      <div class="extra-box">
        {{ (detailInfo && detailInfo.update_time) ? `更新时间：${detailInfo.update_time}` : `创建时间：${detailInfo && detailInfo.create_time}` }}
      </div>
    </div>
    <div class="gitlink">
      <p>git链接: <a :href="detailInfo && detailInfo.git" target="_blank">{{ detailInfo && detailInfo.git }}</a></p>
    </div>
    <div class="banner-wrap">
      <div class="banner" :style="{ background: `url(${detailInfo && detailInfo.banner}) no-repeat`, backgroundPosition: 'center center', backgroundSize: 'cover' }"></div>
      <img :src="detailInfo && detailInfo.banner" alt="">
    </div>
    <div class="detail-desc md-container">
      <div ref="detailbox" v-html="detailInfo && detailInfo.content"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue"
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue';
import { getArticleDetail } from '../../api/articles'
import { formartMd, getMdTitleList } from '../../utils/marked'
const route = useRoute()
const detailInfo = ref<any>(null)
const detailbox = ref(null as HTMLDivElement | null)
const getArticleById = (id: string | string[]) => {
  getArticleDetail({ id }).then((res: any) => {
    console.log(res)
    if (res.code === 0) {
      const content = formartMd(res.data.content)
      console.log('format====', content)
      detailInfo.value = { ...res.data, content }
      nextTick(() => {
        if (detailbox.value) {
          const detailMenuList = getMdTitleList(detailbox.value)
          console.log('detailMenuList===', detailMenuList)
        }
      })
    } else if (typeof res.message === 'object') {
      message.error(res.message && res.message.sqlMessage)
    } else {
      message.error(res.message)
    }
  })
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