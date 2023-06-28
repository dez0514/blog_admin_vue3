<template>
  <div class="pics-wrap">
    <div class="path-wrap">
      <div v-show="pathArr.length > 0" style="font-size: 14px;margin-right: 15px;cursor: pointer"
        @click="handleBackClick">
        <left-outlined />返回上一级
      </div>
      <a-breadcrumb separator="" style="word-break: break-all;">
        <a-breadcrumb-item>当前目录</a-breadcrumb-item>
        <a-breadcrumb-separator>:</a-breadcrumb-separator>
        <a-breadcrumb-item style="cursor: pointer" @click="handlePathClick('', -1)">根目录</a-breadcrumb-item>
        <a-breadcrumb-separator v-if="pathArr.length > 0" />
        <template v-for="(item, index) in pathArr" :key="index">
          <a-breadcrumb-item style="cursor: pointer" @click="handlePathClick(item, index)">{{ item }}
          </a-breadcrumb-item>
          <a-breadcrumb-separator v-if="index < pathArr.length - 1" />
        </template>
      </a-breadcrumb>
    </div>
    <div class="folder_list">
      <div class="folder_wrap" v-for="(item, index) in floderList" :key="index" :title="`双击打开${item.name}`"
        v-mouse-menu="{ params: { ...item, index }, ...menuOptions }" @dblclick="handleCheckFolder(index)">
        <div class="folder"></div>
        <div class="folder-name">{{ item.name }}</div>
      </div>
      <div title="新建文件夹" class="folder_add" @click="handleMkDir">
        <plus-outlined />
        <p style="font-size: 14px;margin-top: 5px;">新建文件夹</p>
      </div>
    </div>
    <div class="add_img">
      <a-upload-dragger v-model:fileList="fileList" name="file" :multiple="true"
        :action="`${baseURL}/api/upload`" :show-upload-list="false" :beforeUpload="beforeUpload"
        :customRequest="customRequest" accept="image/png, image/jpeg, image/jpg, image/gif">
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">点击或拖拽到此处上传图片</p>
      </a-upload-dragger>
    </div>
    <div style="margin-bottom: 10px" v-show="imgList.length > 0">
      <a-button type="primary" @click="handleSelctDel">{{ isSelect ? '取消' : '选择' }}</a-button>
      <a-button type="primary" danger style="margin-left:5px" v-show="isSelect" @click="handleDeletePatch">删除已选
      </a-button>
    </div>
    <div class="pic-list">
      <div :class="['pic-item', isSelect ? 'select_mode' : 'normal']" v-for="(item, index) in imgList" :key="index">
        <div style="padding: 10px;background: rgba(0, 0, 0, .05)">
          <!-- <img :src="`${baseUrl}${currentFolder === '' ? '' : currentFolder + '/'}${item.name}`" alt=""
            @error="onErrorImg"> -->
            <WaterMarkImg :src="`${baseUrl}${currentFolder === '' ? '' : currentFolder + '/'}${item.name}`" alt=""
            @error="onErrorImg" />
        </div>
        <div class="pic-link">{{ item.name }}</div>
        <div class="copy-tip">
          <a-button type="primary"
            @click="copy(`${baseUrl}${currentFolder === '' ? '' : currentFolder + '/'}${item.name}`)">复制地址</a-button>
          <a-button type="primary" style="margin-left: 5px" @click="preview(index)">预览</a-button>
          <a-popconfirm title="确定删除此图片？" cancelText="取消" okText="确定" @confirm="handleDelete(item.name)">
            <a-button class="delete" type="primary">
              <delete-outlined />
            </a-button>
          </a-popconfirm>
        </div>
        <div class="selects-mask" v-show="isSelect" @click="item.checked = !item.checked">
          <a-checkbox class="select-check" v-model:checked="item.checked"></a-checkbox>
        </div>
      </div>
    </div>
    <a-modal :width="500" v-model:visible="visible" :maskClosable="false" title="新建文件夹"
      :confirmLoading="formState.confirmLoad" @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确定">
      <a-form ref="formref" style="margin-top: 20px;" :model="formState">
        <a-form-item label="文件夹名称:" name="folderName" :rules="rulesRef.folderName" v-bind="validateInfos.folderName">
          <a-input v-model:value="formState.folderName" placeholder="文件夹名称" autocomplete="off" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <div class="loadings" v-show="loading">
    <a-spin size="large" />
  </div>
</template>
<script setup lang="ts">
import { ref, inject, reactive, onMounted, computed } from 'vue'
import previewImg from '../../components/previewImage/Index'
import useClipboard from 'vue-clipboard3'
import { DeleteOutlined, PlusOutlined, InboxOutlined, LeftOutlined } from '@ant-design/icons-vue'
import type { UploadFile } from 'ant-design-vue'
import { postMkDir, postDeleteDir, postDeleteFile, getFileList, postImgArray, postDeleteFileMore } from '../../api'
import { Form } from 'ant-design-vue';
import { MouseMenuDirective as vMouseMenu } from '@howdyjs/mouse-menu';
import { promit } from '../../utils'
import defaultImg from '../../assets/default_pic.png'
import { baseURL } from '../../api/urls'
import WaterMarkImg from '../../components/waterMarking/index.vue'
const maxCount = 3
const onErrorImg = (e: any) => {
  e.target.src = defaultImg
}
const baseUrl = `${baseURL}/imgs/`
const menuOptions = {
  menuWidth: 160,
  menuWrapperCss: {
    background: '#fff'
  },
  menuItemCss: {
    hoverBackground: '#ECF4FF',
    hoverTipsColor: 'red'
  },
  useLongPressInMobile: true,
  menuList: [
    {
      label: '打开',
      tips: '',
      fn: (params: any) => {
        handleCheckFolder(params.index)
      }
    },
    {
      label: '删除',
      tips: '谨慎操作！',
      fn: (params: any) => {
        promit(() => {
          console.log('params===', params)
          handleDeldir(params.name)
        }, '提示', '删除此文件夹时，文件夹内全部文件将会被清空，确定删除？')
      }
    }
  ]
}
interface FormState {
  folderName: string;
  confirmLoad: boolean
}
interface folderItem {
  name: string;
  isFolder: boolean;
  checked?: boolean;
}
const useForm = Form.useForm;
const { toClipboard } = useClipboard()
const message: any = inject('$message')
const fileList = ref<UploadFile[]>([])
const selectList = ref<UploadFile[]>([])
const visible = ref<boolean>(false)
const floderList = ref<folderItem[]>([])
const imgList = ref<folderItem[]>([])
const pathArr = ref<string[]>([])
const loading = ref<boolean>(true)
const isSelect = ref<boolean>(false)
const currentFolder = computed(() => {
  return pathArr.value.join('/')
})

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
const handleCheckFolder = (index: number) => {
  // 如果 pathArr
  pathArr.value.push((floderList.value as any)[index].name)
  getFileListData()
}
const handlePathClick = (item: string, index: string | number) => {
  console.log(item, index)
  if (Number(index) === -1 && pathArr.value.length === 0) return
  if (Number(index) >= 0 && pathArr.value.length - Number(index) - 1 === 0) return
  if (item === '') {
    pathArr.value = []
  } else {
    pathArr.value.splice(Number(index) + 1, pathArr.value.length - Number(index) - 1)
  }
  getFileListData()
}
const handleBackClick = () => {
  if (pathArr.value.length === 0) return
  pathArr.value.pop()
  getFileListData()
}
const copy = async (copytxt: string) => {
  try {
    await toClipboard(copytxt)
    message.success('复制成功！')
  } catch {
    message.error('复制失败，请重试')
  }
}
const preview = (index: number) => {
  const srcArr = imgList.value.map(item => `${baseUrl}${currentFolder.value === '' ? '' : currentFolder.value + '/'}${item.name}`)
  const nameList = imgList.value.map(item => item.name)
  previewImg(srcArr, index, nameList)
}
const handleSelctDel = () => {
  isSelect.value = !isSelect.value
  if (!isSelect.value) {
    imgList.value.forEach(item => {
      item.checked = false
    })
  }
}
const handleDeletePatch = () => {
  const names = imgList.value.filter(item => item.checked).map(item => `${currentFolder.value === '' ? '' : currentFolder.value + '/'}${item.name}`)
  console.log(names)
  if (names.length === 0) return
  promit(() => {
    console.log('params===', names)
    loading.value = true
    postDeleteFileMore({ names: names.join(',') }).then((res: any) => {
      console.log(res)
      loading.value = false
      if (Number(res.code) === 0) {
        isSelect.value = false
        getFileListData()
      } else {
        message.error(res.message)
      }
    }).catch(() => {
      loading.value = false
    })
  }, '提示', '确定删除选中图片？')
}
const handleDelete = (name: string) => {
  handleDelFile(name)
}
const beforeUpload = (file: UploadFile, filelist: UploadFile[]) => {
  console.log('before======', filelist)
  loading.value = true
  selectList.value.push(file)
  if (selectList.value.length < filelist.length) {
    return false
  }
  const isExistArr: boolean[] = []
  const nameArr = imgList.value.map(item => item.name)
  filelist.forEach(item => {
    isExistArr.push(nameArr.includes(item.name))
  })
  const isExist = isExistArr.some(item => item)
  if (isExist) {
    message.error('部分资源服务器中已存在，请重新选中');
    loading.value = false
    setTimeout(() => {
      fileList.value = []
      selectList.value = []
    }, 0)
    return false
  }
  if (filelist.length > maxCount) {
    message.error(`一次最多上传${maxCount}张，超出数量！`);
    loading.value = false
    setTimeout(() => {
      fileList.value = []
      selectList.value = []
    }, 0)
    return false
  }
}
const customRequest = (options: any) => {
  // console.log('custom=====', options)
  if (selectList.value.length === fileList.value.length) { // 长度相等时在触发接口
    const formData = new FormData()
    formData.append("dest", currentFolder.value)
    selectList.value.forEach((item: any) => {
      formData.append("file", item)
    })
    postImgArray(formData).then((res: any) => {
      loading.value = false
      if (Number(res.code) === 0) {
        message.success(`${selectList.value.map(item => item.name).join(',')} ${res.message}`);
      } else {
        message.error(res.message);
      }
      setTimeout(() => {
        fileList.value = []
        selectList.value = []
      }, 300)
      getFileListData()
    }).catch(() => {
      loading.value = false
    })
  }
}
const handleMkDir = () => {
  visible.value = true
}
const handleOk = () => {
  validate().then(() => {
    formState.confirmLoad = true
    const params = {
      name: currentFolder.value === '' ? formState.folderName : `${currentFolder.value}/${formState.folderName}`
    }
    postMkDir(params).then((res: any) => {
      formState.confirmLoad = false
      if (Number(res.code) === -1) {
        message.error(res.message);
        return
      }
      if (Number(res.code) === 0) {
        message.success(res.message);
        handleCancel()
        getFileListData()
      } else {
        message.error(res.message);
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
const handleDeldir = (name: string) => {
  loading.value = true
  const params = {
    name: currentFolder.value === '' ? name : `${currentFolder.value}/${name}`
  }
  postDeleteDir(params).then((res: any) => {
    loading.value = false
    if (Number(res.code) === 0) {
      message.success(res.message)
      getFileListData()
    } else {
      message.error(res.message)
    }
  })
}
const handleDelFile = (name: string) => {
  loading.value = true
  const params = {
    name: currentFolder.value === '' ? name : `${currentFolder.value}/${name}`
  }
  postDeleteFile(params).then((res: any) => {
    console.log(res)
    loading.value = false
    if (Number(res.code) === 0) {
      message.success(res.message)
      getFileListData()
    } else {
      message.error(res.message)
    }
  })
}
const getFileListData = () => {
  loading.value = true
  imgList.value = []
  getFileList({ name: currentFolder.value }).then(res => {
    console.log(res)
    const list = res.data.map((item: any) => {
      return {
        name: item.name,
        isFolder: item.isFolder
      }
    })
    floderList.value = list.filter((item: any) => item.isFolder)
    imgList.value = list.filter((item: any) => !item.isFolder)
    imgList.value.forEach((item) => {
      item.checked = false
    })
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}
onMounted(() => {
  getFileListData()
})
</script>

<style lang="scss" scoped>
.pics-wrap {
  position: relative;
  height: calc(100% - 20px);
  overflow-y: auto;
  padding: 0 20px;
}

.loadings {
  position: absolute; // 它的外层是 main.vue 的.main 要给 relative
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, .7);
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
  flex-direction: column;
  width: 100px;
  height: 100px;
  border: 2px solid #333;
  color: #333;
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
  cursor: pointer;
}

.folder-name {
  box-sizing: border-box;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000;
  font-size: 14px;
  padding: 0 12px;
}

.folder {
  width: 100px;
  height: 100px;
  background: url(../../assets/folder.png) no-repeat;
  background-position: 0 -12px;
  background-size: 100% 100%;
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
      margin: 0 auto;
      max-width: 100%;
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

    .selects-mask {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .1);
      cursor: pointer;

      .select-check {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  }

  .normal:hover .copy-tip {
    display: block;
  }
}

.path-wrap {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
}
</style>
