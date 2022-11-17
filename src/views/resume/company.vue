<template>
  <div class="page-container">
    <div class="content-wrap">
      <a-button type="primary" style="margin-bottom: 8px" @click="handleBatchAdd">批量新增</a-button>
      <a-table :dataSource="dataSource" :columns="columns" :pagination="false" :scroll="{y: `calc(100vh - 64px - 85px - 40px - 48px - 55px - 40px)`}">
        <template #bodyCell="{ column, text, record }">
          <template v-if="['name', 'durings'].includes(column.dataIndex)">
            <div>
              <a-input v-if="editableData[record.key]" v-model:value="(editableData as any)[record.key][column.dataIndex]" style="margin: -5px 0" allow-clear/>
              <template v-else>{{ text || '--' }}</template>
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
    <a-modal :width="800" v-model:visible="visible" :maskClosable="false" title="新增工作单位" @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确定">
      <div style="margin-bottom: 5px;">
        <a-button type="primary" style="margin-right: 5px" @click="handleAddRow">新增空行</a-button>
        <a-button type="primary" @click="handleDeleteSelectedRow">删除选中行</a-button>
      </div>
      <a-form ref="formref" style="margin-top: 20px;" :model="dynamicValidateForm">
        <a-table class="patchform-wrap" :row-selection="{ selectedRowKeys: selectedKeys, onChange: onSelectChange }" :dataSource="dynamicValidateForm.addList" :columns="dialogColumn" :pagination="false" :scroll="{ y: '500px' }">
          <template #headerCell="{ title }">
            <span style="color: red; vertical-align: middle;">* </span>{{title}}
          </template>
          <template #bodyCell="{ column, record, index }">
            <template v-if="['name', 'durings'].includes(column.dataIndex)">
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
          </template>
        </a-table>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, inject, toRaw, onMounted } from 'vue'
import type { UnwrapRef } from 'vue'
import { companyItem, columnItem } from "../../types"
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { promit } from '../../utils'
import { addCompanyList, addCompany, getCompanys, deleteCompany } from '../../api/company'

const formref = ref(null as HTMLFormElement | null)
const message: any = inject('$message')
const dataSource = ref<companyItem[]>([])
const columns: columnItem[] = [
  {
    title: '单位名称',
    dataIndex: 'name',
    key: 'name',
    align:'center'
  },
  {
    title: '时间段',
    dataIndex: 'durings',
    key: 'durings',
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
const editableData: UnwrapRef<Record<string, companyItem>> = reactive({})
const visible = ref<boolean>(false)
const dynamicValidateForm = reactive<{ addList: companyItem[] }>({
  addList: []
});
dynamicValidateForm.addList = [
  {
    key: uuidv4(),
    name: '',
    durings: ''
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
    name: '',
    durings: ''
  })
}
const handleDeleteSelectedRow = () => {
  if (selectedKeys.value.length === 0) return
  if (dynamicValidateForm.addList.length === 1) {
    message.error('至少保留一条')
    return
  }
  promit(() => {
    const temp = dynamicValidateForm.addList.filter(item => !selectedKeys.value.includes(item.key))
    if (temp.length === 0) {
      temp.push({
        key: uuidv4(),
        name: '',
        durings: ''
      })
    }
    dynamicValidateForm.addList = temp
    selectedKeys.value = []
  }, '提示', '确定删除此行？')
}
const onSelectChange = (selectedRowKeys: string[]) => {
  selectedKeys.value = selectedRowKeys
}
// 查询列表
const getCompanyList = () => {
  getCompanys().then((res: any) => {
    console.log(res)
    if(res.code === 0) {
      dataSource.value = res.data.map((item: any) => {
        return {
          key: item.id, // id 都用key 表示。。。懒得改了。。
          name: item.name,
          durings: item.durings
        }
      })
    } else {
      message.error(res.message)
    }
  })
}
// 批量添加 确认
const handleOk = () => {
  formref?.value?.validate().then(() => {
    const temp = toRaw(dynamicValidateForm).addList
    const params = {
     companys: temp.map(item => {
      return { name: item.name, durings: item.durings }
     })
    }
    addCompanyList(params).then((res: any) => {
      if(res.code === 0) {
        message.success(res.message)
        visible.value = false
        dynamicValidateForm.addList = [{
          key: uuidv4(),
          name: '',
          durings: ''
        }]
        getCompanyList()
      } else {
        message.error(res.message)
      }
    })
  }).catch((err: any) => {
    console.log('err==', err)
  })
}
const handleCancel = () => {
  visible.value = false
  dynamicValidateForm.addList = [{
    key: uuidv4(),
    name: '',
    durings: ''
  }]
}
// table methods
const handleEdit = (key: string) => {
  console.log(key)
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
  // console.log('editableData==', editableData)
}
const handleSaveRow = (key: string) => {
  // 校验 不能为空的 保存
  if(!editableData[key].name) {
    message.error('name不能为空')
    return
  }
  if(!editableData[key].durings) {
    message.error('durings不能为空')
    return
  }
  // console.log('save ===', editableData[key])
  const params = {
    id: editableData[key].key,
    name: editableData[key].name,
    durings: editableData[key].durings
  }
  addCompany(params).then((res: any) => {
    if(res.code === 0) {
      message.success(res.message)
      Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
      delete editableData[key]
    } else {
      message.error(res.message)
    }
  })
}
const handleCancelRow = (key: string) => {
  delete editableData[key];
}
const confirmDeleteRow = (key: string) => {
  const params = {
    id: key
  }
  deleteCompany(params).then((res: any) => {
    if(res.code === 0) {
      message.success(res.message)
      getCompanyList()
    } else {
      message.error(res.message)
    }
  })
}
onMounted(() => {
  getCompanyList()
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
  height: 100%;
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
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: transparent;
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
