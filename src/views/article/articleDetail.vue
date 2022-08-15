<template>
  <div class="detail-page">
    <div class="title">{{ detailInfo && detailInfo.title }}</div>
    <div class="stitle">{{ detailInfo && detailInfo.extra_title }}</div>
    <div class="tags">{{ detailInfo && detailInfo.tags }}</div>
    <div class="banner">
      <img :src="detailInfo && detailInfo.banner" alt="">
    </div>
    <div class="desc md-container">
      <!-- <div>{{ detailInfo && detailInfo.content }}</div> -->
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
.title {
  text-align: center;
  font-size: 22px;
}
.stitle {
  text-align: center;
}
.tags {
  text-align: center;
}
.banner img {
  display: block;
  margin: 0 auto;
  max-height: 200px;
}
</style>