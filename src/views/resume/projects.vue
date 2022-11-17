<template>
  <div class="page-container">
    <div class="content-wrap">
      <a-button type="primary" style="margin-bottom: 8px" @click="handleAddProject">新增项目</a-button>
      <a-table :dataSource="dataSource" :columns="columns" :pagination="false"
        :scroll="{ y: `calc(100vh - 64px - 85px - 40px - 48px - 55px - 40px)` }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <span>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm v-if="dataSource.length" title="确定删除此条数据？" cancelText="取消" okText="确定"
                @confirm="confirmDeleteRow(record.key)">
                <a style="color: #ff4d4f">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>
    </div>
    <a-modal v-model:visible="visible" title="新增项目" @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确定">
      <a-form ref="formref" style="margin-top: 10px;" :model="formPopState" name="basic" autocomplete="off">
        <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ offset: 1 }" label="项目名称" name="name">
          <a-input v-model:value="formPopState.name" />
        </a-form-item>
        <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ offset: 1 }" label="简述" name="intro">
          <a-input v-model:value="formPopState.intro" />
        </a-form-item>
        <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ offset: 1 }" label="技术栈" name="technology">
          <a-input v-model:value="formPopState.technology" />
        </a-form-item>
        <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ offset: 1 }" label="详细" name="details">
          <a-input v-model:value="formPopState.details" />
        </a-form-item>
        <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ offset: 1 }" label="所属单位" name="companyId">
          <a-select v-model:value="formPopState.companyId" placeholder="请选择单位" :options="optionList"
            option-label-prop="name">
            <template #option="{ name }">{{ name }}</template>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <div class="page-wrap">
      <a-pagination v-model:current="pageNum" :total="total" show-less-items />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, inject, onMounted } from 'vue'
import { projectItem, columnItem } from "../../types"
import { addProject, getPageProjects, deleteProject } from '../../api/project'
import { getCompanys } from '../../api/company'
const formref = ref(null as HTMLFormElement | null)
const message: any = inject('$message')
const dataSource = ref<projectItem[]>([])
interface optItem {
  value: number | string;
  name: string;
}
interface popItem {
  id?: string | number;
  name: string;
  intro: string;
  technology: string;
  details: string;
  companyId: number | string;
  sort?: number;
}
const optionList = ref<optItem[]>([])
const pageNum = ref<number>(1)
const pageSize = 10
const total = ref<number>(0)
const columns: columnItem[] = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '所属单位',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center'
  },
  {
    title: '简述',
    dataIndex: 'intro',
    key: 'intro',
    align: 'center'
  },
  {
    title: '技术栈',
    dataIndex: 'technology',
    key: 'technology',
    align: 'center'
  },
  {
    title: '详细',
    dataIndex: 'details',
    key: 'details',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center'
  }
]
const visible = ref<boolean>(false)
const formPopState = reactive<popItem>({
  id: '',
  name: '',
  intro: '',
  technology: '',
  details: '',
  companyId: ''
})
const handleAddProject = () => {
  visible.value = true
}
// 查询列表
const getProjectList = () => {
  const params = {
    pageSize: pageSize,
    pageNum: pageNum.value
  }
  getPageProjects(params).then((res: any) => {
    console.log(res)
    if (res.code === 0) {
      res.data.forEach((item: any) => {
        if(item.companyInfo && item.companyInfo.length > 0) {
          item.companyId = item.companyInfo[0].companyId
          item.companyName = item.companyInfo[0].name
        } else {
          item.companyId = ''
          item.companyName = ''
        }
      })
      dataSource.value = res.data.map((item: any) => {
        return {
          key: item.id,
          name: item.name,
          intro: item.intro,
          technology: item.technology,
          details: item.details,
          sort: item.sort,
          companyId: String(item.companyId),
          companyName: item.companyName
        }
      })
      total.value = Number(res.total)
    } else {
      message.error(res.message)
    }
  })
}
const getCompanyList = () => {
  getCompanys().then((res: any) => {
    if (res.code === 0) {
      optionList.value = res.data.map((item: any) => {
        return {
          value: String(item.id),
          name: item.name
        }
      })
      console.log('optionList==', optionList.value)
    } else {
      message.error(res.message)
    }
  })
}
// 批量添加 确认
const handleOk = () => {
  formref?.value?.validate().then(() => {
    const params = {
      id: formPopState.id || '',
      name: formPopState.name,
      intro: formPopState.intro,
      technology: formPopState.technology,
      details: formPopState.details,
      companyId: formPopState.companyId
    }
    addProject(params).then((res: any) => {
      if (res.code === 0) {
        message.success(res.message)
        visible.value = false
        getProjectList()
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
  formPopState.id = ''
  formPopState.name = ''
  formPopState.intro = ''
  formPopState.technology = ''
  formPopState.details = ''
  formPopState.companyId = ''
}
// table methods
const handleEdit = (record: any) => {
  console.log(record)
  formPopState.id = record.key
  formPopState.name = record.name
  formPopState.intro = record.intro
  formPopState.technology = record.technology
  formPopState.details = record.details
  formPopState.companyId = record.companyId
  visible.value = true
}
const confirmDeleteRow = (key: string) => {
  const params = {
    id: key
  }
  deleteProject(params).then((res: any) => {
    if (res.code === 0) {
      message.success(res.message)
      pageNum.value = 1
      getProjectList()
    } else {
      message.error(res.message)
    }
  })
}
onMounted(() => {
  getProjectList()
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
  .ant-table-tbody>tr>td.ant-table-cell {
    padding-top: 22px;
    padding-bottom: 22px
  }

  .ant-table-tbody>tr.ant-table-row-selected>td {
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
