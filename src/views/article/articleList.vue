<template>
  <div class="page-container">
    <div class="content-wrap">
      <!-- y = 页面高度[100vh] - header[60px] - (bread + title)[共85px] - 上下padding[共40px] - pagination容器高度[48px] - 表头高度[55px] -->
      <a-table :dataSource="dataSource" :columns="columns" :pagination="false" :scroll="{y: `calc(100vh - 64px - 85px - 40px - 48px - 55px)`}">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a @click="handleEdit(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="dataSource.length"
              title="确定删除此条数据?"
              cancelText="取消"
              okText="确定"
              @confirm="onDelete(record.key)"
            >
              <a style="color: #ff4d4f">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
    <div class="page-wrap">
      <a-pagination v-model:current="current" :total="50" show-less-items />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import { articleItem, columnItem } from "../../types";
const dataSource = ref<articleItem[]>([])
const columns = ref<columnItem[]>([])
const current = ref(1)
dataSource.value = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  },
  {
    key: '3',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '4',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  },
  {
    key: '5',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '6',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  },
  {
    key: '7',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '8',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  },
  {
    key: '9',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '10',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  },
  {
    key: '11',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '12',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  },
  {
    key: '13',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '14',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  },
]
columns.value = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align:'center'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    align:'center'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    align:'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align:'center'
  }
]
const handleEdit = (val: any) => {
  console.log(val)
}
const onDelete = (val: string) => {
  console.log(val)
}
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
