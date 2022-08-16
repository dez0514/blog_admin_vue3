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
    <div class="banner" :style="{ background: `url(${detailInfo && detailInfo.banner}) no-repeat`, backgroundPosition: 'center center', backgroundSize: 'cover' }">
      <img :src="detailInfo && detailInfo.banner" alt="">
    </div>
    <div class="detail-desc md-container">
      <div v-html="detailInfo && detailInfo.content"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue';
import { getArticleDetail } from '../../api/articles'
import { formartMd } from '../../utils/marked'
const route = useRoute()
const detailInfo = ref<any>(null)
const getArticleById = (id: string | string[]) => {
  getArticleDetail({ id }).then((res: any) => {
    console.log(res)
    if (res.code === 0) {
      const content = formartMd(res.data.content)
      console.log('format====', content)
      detailInfo.value = { ...res.data, content }
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
.banner {
  overflow: hidden;
  position: relative;
  height: 350px;
  width: 100%;
  background-color: #f0f2f7;
  border-radius: 10px;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .6);
    filter: blur(20px);
  }
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
.detail-desc {
  margin-top: 20px;
}
</style>