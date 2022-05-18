<template>
  <div class="page-container">
    <div class="content-wrap">
      <a-button type="primary" style="margin-bottom: 8px" @click="handleBatchAdd">批量新增</a-button>
      <a-table :dataSource="dataSource" :columns="columns" :pagination="false" :scroll="{y: `calc(100vh - 64px - 85px - 40px - 48px - 55px - 40px)`}">
        <template #bodyCell="{ column, text, record }">
          <template v-if="['tagname', 'icon'].includes(column.dataIndex)">
            <div>
              <a-input v-if="editableData[record.key]" v-model:value="(editableData as any)[record.key][column.dataIndex]" style="margin: -5px 0" allow-clear/>
              <template v-else>{{ text }}</template>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'color'">
            <div>
              <color-picker
                v-if="editableData[record.key]"
                pickerType="fk"
                useType="pure"
                lang="ZH-cn"
                format="hex"
                :disableHistory="true"
                :disableAlpha="true"
                gradientColor="linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)"
                v-model:pureColor="(editableData as any)[record.key][column.dataIndex]"
              />
              <template v-else>
                <span class="color-spanbox" :style="{ background: text }"></span>
                <span style="vertical-align: middle;">{{ text }}</span>
              </template>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'view'">
            <div>
              <span v-if="editableData[record.key]" class="view-box" :style="{color: editableData[record.key]['color']}">{{editableData[record.key]['tagname']}}</span>
              <span v-else class="view-box" :style="{color: record['color']}">{{record['tagname']}}</span>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="editable-row-operations">
              <span v-if="editableData[record.key]">
                <a-popconfirm title="确定保存修改？"
                  cancelText="取消"
                  okText="确定" 
                  @confirm="handleSaveRow(record.key)"
                >
                  <a>保存</a>
                </a-popconfirm>
                <a-divider type="vertical" />
                <a-typography-link @click="handleCancelRow(record.key)">取消</a-typography-link>
              </span>
              <span v-else>
                <a @click="handleEdit(record.key)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  v-if="dataSource.length"
                  title="确定删除此条数据？"
                  cancelText="取消"
                  okText="确定"
                  @confirm="confirmDeleteRow(record.key)"
                >
                  <a style="color: #ff4d4f">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </template>
      </a-table>
    </div>
    <a-modal :width="800" v-model:visible="visible" :maskClosable="false" title="新增标签" @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确定">
      <div style="margin-bottom: 5px;">
        <a-button type="primary" style="margin-right: 5px" @click="handleAddRow">新增空行</a-button>
        <a-button type="primary" @click="handleDeleteSelectedRow">删除选中行</a-button>
      </div>
      <a-form ref="formref" style="margin-top: 20px;" :model="dynamicValidateForm">
        <a-table class="patchform-wrap" :row-selection="{ selectedRowKeys: selectedKeys, onChange: onSelectChange }" :dataSource="dynamicValidateForm.addList" :columns="dialogColumn" :pagination="false" :scroll="{ y: '500px' }">
          <template #headerCell="{ title, column }">
            <span style="color: red; vertical-align: middle;" v-if="column.key !== 'color' && column.key !== 'view'">* </span>{{title}}
          </template>
          <template #bodyCell="{ column, record, index }">
            <template v-if="['tagname', 'icon'].includes(column.dataIndex)">
              <div class="table-form-wrap">
                <a-form-item :name="['addList', index, column.dataIndex]" 
                  :rules="{
                    required: true,
                    message: `请输入${column.dataIndex}`
                  }"
                >
                  <a-input v-model:value="record[column.dataIndex]" style="margin: -5px 0" autocomplete="off" allow-clear/>
                </a-form-item>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'color'">
              <div>
                <color-picker
                  pickerType="fk"
                  useType="pure"
                  lang="ZH-cn"
                  format="hex"
                  :disableHistory="true"
                  :disableAlpha="true"
                  gradientColor="linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)"
                  v-model:pureColor="record[column.dataIndex]"
                />
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'view'">
              <div>
                <span class="view-box" :style="{color: record['color']}">{{record['tagname']}}</span>
              </div>
            </template>
          </template>
        </a-table>
      </a-form>
    </a-modal>
    <div class="page-wrap">
      <a-pagination v-model:current="current" :total="50" show-less-items />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, inject, toRaw } from 'vue'
import type { UnwrapRef } from 'vue'
import { tagItem, columnItem } from "../../types"
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { promit } from '../../utils'
const formref = ref(null as HTMLFormElement | null)
const message: any = inject('$message')
const dataSource = ref<tagItem[]>([])
const columns: columnItem[] = [
  {
    title: '标签名称',
    dataIndex: 'tagname',
    key: 'tagname',
    align:'center'
  },
  {
    title: '小图标',
    dataIndex: 'icon',
    key: 'icon',
    align:'center'
  },
  {
    title: '颜色',
    dataIndex: 'color',
    key: 'color',
    align:'center'
  },
  {
    title: '视图',
    dataIndex: 'view',
    key: 'view',
    align:'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align:'center'
  }
]
const dialogColumn: columnItem[] = columns.filter(item => item.key !== 'operation')
const current = ref(1)
dataSource.value = [
  {
    key: uuidv4(),
    tagname: 'vue',
    icon: 'xxx',
    color: '#ff0000'
  },
  {
    key: uuidv4(),
    tagname: 'react',
    icon: 'xxx',
    color: '#ff0000'
  }
]
const editableData: UnwrapRef<Record<string, tagItem>> = reactive({})
const visible = ref<boolean>(false)
const dynamicValidateForm = reactive<{ addList: tagItem[] }>({
  addList: []
});
dynamicValidateForm.addList = [
  {
    key: uuidv4(),
    tagname: '',
    icon: '',
    color: '#ff0000'
  }
]
const selectedKeys = ref<string[]>([])
// methods 批量新增
const handleBatchAdd = () => {
  visible.value = true
  Object.keys(editableData).forEach(item => {
    delete editableData[item]
  })
}
// model methods
const handleAddRow = () => {
  dynamicValidateForm.addList.push({
    key: uuidv4(),
    tagname: '',
    icon: '',
    color: '#ff0000'
  })
}
const handleDeleteSelectedRow = () => {
  if (selectedKeys.value.length === 0) return
  if (dynamicValidateForm.addList.length === 1) {
    message.error('至少保留一条')
    return
  }
  promit(() => {
    const temp = dynamicValidateForm.addList.filter(item =>
      !selectedKeys.value.includes(item.key)
    )
    if (temp.length === 0) {
      temp.push({
        key: uuidv4(),
        tagname: '',
        icon: '',
        color: '#ff0000'
      })
    }
    dynamicValidateForm.addList = temp
    selectedKeys.value = []
  }, '提示', '确定删除此行？')
}
const onSelectChange = (selectedRowKeys: string[]) => {
  selectedKeys.value = selectedRowKeys
}
const handleOk = () => {
  // console.log('formref==',formref.value)
  formref?.value?.validate().then(() => {
    console.log(toRaw(dynamicValidateForm))
  }).catch((err: any) => {
    console.log('err==', err)
  })
}
const handleCancel = () => {
  visible.value = false
  dynamicValidateForm.addList = [{
    key: uuidv4(),
    tagname: '',
    icon: '',
    color: '#ff0000'
  }]
}
// table methods
const handleEdit = (key: string) => {
  console.log(key)
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
  console.log('editableData==', editableData)
}
const handleSaveRow = (key: string) => {
  // 校验 不能为空的 保存
  if(!editableData[key].tagname) {
    message.error('tagname不能为空')
    return
  }
  if(!editableData[key].icon) {
    message.error('icon不能为空')
    return
  }
  // console.log('save ===', editableData[key])
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  delete editableData[key]
}
const handleCancelRow = (key: string) => {
  delete editableData[key];
}
const confirmDeleteRow = (val: string) => {
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
.color-spanbox {
  position: relative;
  top: 1px;
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
  vertical-align: middle;
}
:deep(.patchform-wrap) {
  .ant-table-tbody > tr > td.ant-table-cell {
    padding-top: 22px;
    padding-bottom: 22px
 }
}
:deep(.table-form-wrap .ant-form-item) {
  margin-bottom: 0;
  .ant-form-item-explain {
    position: absolute;
    top: 30px;
  }
}
.view-box {
  display: inline-block;
  position: relative;
  padding: 2px 14px 3px;
}
.view-box:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: currentColor;
  opacity: .15;
  border-radius: 20px;
}
</style>
