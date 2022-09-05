<template>
  <div class="page-container">
    <div class="content-wrap">
      <!-- y = 页面高度[100vh] - header[60px] - (bread + title)[共85px] - 上下padding[共40px] - pagination容器高度[48px] - 表头高度[55px] -->
      <a-table :dataSource="dataSource" :columns="columns" :pagination="false" :scroll="{y: `calc(100vh - 64px - 85px - 40px - 48px - 55px)`, x: 1625}">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'banner'">
            <img v-if="record.banner" style="width: 60px;" :src="record.banner" alt="" />
            <span v-else>--</span>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a @click="handleDetail(record)">查看</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="dataSource.length"
              title="确定删除此条数据?"
              cancelText="取消"
              okText="确定"
              @confirm="onDelete(record)"
            >
              <a style="color: #ff4d4f">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
    <div class="page-wrap">
      <a-pagination v-model:current="pageNum" :pageSize="pageSize" :total="total" show-less-items @change="getList" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import { articleItem } from "../../types";
import { deleteArticle, getArticlesPage } from '../../api/articles'
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router'
const router = useRouter();
const dataSource = ref<articleItem[]>([])
const pageSize = 10
const pageNum = ref<number>(1)
const total = ref<number>(0)
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    align:'center',
    fixed: 'left'
  },
  {
    title: '小标题',
    dataIndex: 'extra_title',
    key: 'extra_title',
    ellipsis: true,
    align:'center'
  },
  {
    title: '封面',
    dataIndex: 'banner',
    key: 'banner',
    ellipsis: true,
    align:'center'
  },
  {
    title: '文章标签',
    dataIndex: 'tags',
    key: 'tags',
    ellipsis: true,
    align:'center'
  },
  {
    title: '文章地址',
    dataIndex: 'git',
    key: 'git',
    ellipsis: true,
    align:'center'
  },
  {
    title: '文章内容',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
    align:'center'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    align:'center',
    ellipsis: true
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    align:'center',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align:'center',
    width: 180,
    fixed: 'right'
  }
]
const getList = () => {
  const params = {
    pageSize: pageSize,
    pageNum: pageNum.value
  }
  getArticlesPage(params).then((res: any) => {
    if(res.code === 0) {
      dataSource.value = res.data
      total.value = Number(res.total)
    } else if(typeof res.message === 'object') {
      message.error(res.message && res.message.sqlMessage)
    } else {
      message.error(res.message)
    }
  })
}
const handleEdit = (val: any) => {
  router.push(`/article/create/${val.id}`)
}
const handleDetail = (val: any) => {
  router.push(`/article/detail/${val.id}`)
}
const onDelete = (val: any) => {
  deleteArticle({ id: val.id }).then((res: any) => {
    if(res.code === 0) {
      message.success(res.message)
      getList()
    } else if(typeof res.message === 'object') {
      message.error(res.message && res.message.sqlMessage)
    } else {
      message.error(res.message)
    }
  })
}
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
.page-container {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  padding: 0 20px;
}
.content-wrap {
  box-sizing: border-box;
  height: calc(100% - 48px);
  padding-bottom: 20px;
}
.page-wrap {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: end;
  width: 100%;
  padding: 0 20px;
  text-align: right;
  height: 48px;
  border-top: 1px solid #f0f0f0;
}
</style>
