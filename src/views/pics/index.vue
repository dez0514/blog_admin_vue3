<template>
  <div class="pics-wrap">
    <div class="folder_list">
      <div class="folder_wrap" v-for="(item,index) in floderList" :key="index" @click="handleCheckFolder(index)" >
        <div :class="[folderTabIndex === index ? 'open_folder' : 'folder']"></div>
        <div class="folder-name">{{item.name}}</div>
      </div>
      <div title="新建文件夹" class="folder_add" @click="handleMkDir">
        <plus-outlined />
      </div>
      <!-- 弹出 新建文件夹 -->
    </div>
    <div class="add_img">
      <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="true"
        action="/api/upload"
        @change="handleChange"
        @drop="handleDrop"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">点击或拖拽到此处上传图片</p>
      </a-upload-dragger>
    </div>
    <div class="pic-list">
      <div class="pic-item">
        <div style="padding: 10px"><img src="http://localhost:8081/imgs/bd_marker.png" alt=""></div>
      </div>
      <div class="pic-item" v-for="(item, index) in bannerList" :key="index">
        <div style="padding: 10px"><img :src="getImageUrl(item)" alt=""></div>
        <div class="pic-link">{{item}}</div>
        <div class="copy-tip">
          <a-button type="primary" @click="copy(item)">复制地址</a-button>
          <a-button type="primary" style="margin-left: 5px" @click="preview(index)">预览</a-button>
          <a-popconfirm
            title="确定删除此图片？"
            cancelText="取消"
            okText="确定"
            @confirm="handleDelete(index)"
          >
            <a-button class="delete" type="primary"><delete-outlined /></a-button>
          </a-popconfirm>
        </div>
      </div>
    </div>
    <a-modal :width="500" v-model:visible="visible" :maskClosable="false" title="新建文件夹" :confirmLoading="formState.confirmLoad" @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确定">
      <a-form ref="formref" style="margin-top: 20px;" :model="formState">
        <a-form-item label="文件夹名称:" name="folderName" :rules="rulesRef.folderName" v-bind="validateInfos.folderName">
          <a-input v-model:value="formState.folderName" placeholder="文件夹名称" autocomplete="off" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref, inject, reactive, onMounted } from 'vue'
import previewImg from '../../components/previewImage'
import useClipboard from 'vue-clipboard3'
import { DeleteOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons-vue'
import type { UploadChangeParam } from 'ant-design-vue'
import { postMkDir, postDeleteDir, postDeleteFile, getFileList} from '../../api'
import { Form } from 'ant-design-vue';
interface FormState {
  folderName: string;
  confirmLoad: boolean
}
interface folderItem {
  name: string;
  isFolder: boolean;
}
const useForm = Form.useForm;
const { toClipboard } = useClipboard()
const message: any = inject('$message')
const folderTabIndex = ref<number>(-1)
const fileList = ref([])
const visible = ref<boolean>(false)
const currentFolder = ref<string>('')
const floderList = ref<folderItem[]>([])

const formState = reactive<FormState>({
  folderName: '',
  confirmLoad: false
});
const rulesRef = reactive({
  folderName: [
    {
      required: true,
      message: '请输入文件夹名称',
    }
  ]
})
const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);
const getImageUrl = (name: string) => {
  return new URL(`../../assets/test/${name}`, import.meta.url).href
}
const bannerList = ['test1.jpg', 'test2.jpg', 'test3.jpg', 'test4.jpg']
const handleCheckFolder = (index: number) => {
  folderTabIndex.value = index
}
const copy = async (copytxt: string) => {
  try {
    await toClipboard(copytxt)
    message.success('复制成功！')
  } catch {
    message.success('复制失败，请重试')
  }
}
const preview = (index: number) => {
  const srcArr = bannerList.map(item => getImageUrl(item))
  previewImg(srcArr, index, bannerList)
}
const handleDelete = (index: number) => {
  console.log('删除图片，列表传id', index)
}
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
}
const handleDrop = (e: DragEvent) => {
  console.log(e)
}
const handleMkDir = () => {
  visible.value = true
  // getFileListData()
}
const handleOk = () => {
  validate().then(() => {
    formState.confirmLoad = true
    postMkDir({ name: formState.folderName }).then((res: any) => {
      formState.confirmLoad = false
      if(Number(res.code) === -1) {
        message.error(res.message);
        return
      }
      if(Number(res.code) === 0) {
        message.success(res.message);
        handleCancel()
      }
    }).catch(err => {
      console.log('err==', err)
    })
  })
}
const handleCancel = () => {
  formState.folderName = ''
  visible.value = false
  resetFields()
}
const handleDeldir = () => {
  postDeleteDir({name: 'test_two'}).then(res => {
    console.log(res)
  })
}
const handleDelFile = () => {
  postDeleteFile({name: 'test_two/bd_marker.png'}).then(res => {
    console.log(res)
  })
}
const getFileListData = () => {
  getFileList({ name: currentFolder.value }).then(res => {
    console.log(res)
    const list = res.data.map((item: any) => {
      return {
        name: item.name,
        isFolder: item.isFolder
      }
    })
    floderList.value = list.filter((item:any) => item.isFolder)
  })
}
onMounted(() => {
  getFileListData()
})
</script>

<style lang="scss" scoped>
.pics-wrap {
  height: calc(100% - 20px);
  overflow-y: auto;
  padding: 0 20px;
}
.folder_list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}
.folder_add {
  margin-left: 8px;
  display: flex;
  width: 100px;
  height: 100px;
  border: 2px solid #333;
  color: $sunset;
  text-align: center;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
}
.add_img {
  margin-bottom: 10px;
}
.folder_wrap {
  position: relative;
  width: 100px;
}
.folder-name {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100px;
  text-align: center;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000;
}
.folder {
  width: 100px;
  height: 100px;
  background: url(../../assets/folder.png) no-repeat;
  background-position: 0 -12px;
  background-size: 100% 100%;
}
.open_folder {
  width: 100px;
  height: 100px;
  background: url(../../assets/open_folder.png) no-repeat;
  background-position: 8px 5px;
  background-size: 84% 68%;
}
.pic-list {
  column-count: 4;
  column-gap: 10px;
  .pic-item {
    position: relative;
    break-inside: avoid;
    box-sizing: border-box;
    border: 1px solid #eaeaea;
    margin-bottom: 10px;
    font-weight: bold;
    color: #000;
    img {
      display: block;
      width: 100%;
    }
    .pic-link {
      padding: 10px;
      border-top: 1px solid #eaeaea;
    }
    .copy-tip {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .5);
      .delete {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .pic-item:hover .copy-tip {
    display: block;
  }
}
</style>
