<template>
  <div style="padding: 0 20px;">
    <a-form style="margin-top: 10px;" :model="formState" name="basic" autocomplete="off" @finish="onSubmit"
      @finishFailed="onSubmitFailed">
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="标题" name="title"
        :rules="[{ required: true, message: '请输入标题!' }]">
        <a-input v-model:value="formState.title" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="小标题" name="extraTitle"
        :rules="[{ required: true, message: '请输入小标题!' }]">
        <a-input v-model:value="formState.extraTitle" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="封面地址" name="banner">
        <a-input v-model:value="formState.banner" style="width: calc(100% - 100px);margin-right: 12px;" allowClear />
        <a-button type="primary" @click="showModalUpload">上传封面</a-button>
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="git地址" name="git">
        <a-input v-model:value="formState.git" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="标签" name="tags"
        :rules="[{ required: true, message: '请选择标签!' }]">
        <a-select v-model:value="formState.tags" mode="multiple" style="width: calc(100% - 100px);margin-right: 12px;"
          placeholder="请选择标签" :options="optionList" @change="handleChange"></a-select>
        <a-button type="primary" @click="showModal">新增标签</a-button>
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 18 }" label="内容" name="content"
        :rules="[{ required: true, message: '请输入内容!' }]">
        <md-editor v-model="formState.content" :toolbars="toolbars" :style="{ height: '440px' }"
          preview-theme="vuepress" @htmlChanged="getEditorHtml" />
      </a-form-item>
      <a-form-item style="margin-bottom: 0;" :wrapper-col="{ offset: 3, span: 14 }">
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
    <a-modal v-model:visible="visibleUpload" title="上传封面">
      <template #footer>
        <a-button type="primary" @click="handleCloseUpload">关闭</a-button>
      </template>
      <div>
        <a-upload-dragger v-model:fileList="fileList" name="file" :multiple="false" :action="`${baseURL}/api/upload`"
          :show-upload-list="false" :customRequest="customRequest"
          accept="image/png, image/jpeg, image/jpg, image/gif">
          <p class="ant-upload-drag-icon">
            <inbox-outlined />
          </p>
          <p class="ant-upload-text">点击或拖拽到此处上传图片</p>
        </a-upload-dragger>
      </div>
    </a-modal>
    <a-modal v-model:visible="visible" title="新增标签" @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确定">
      <a-form style="margin-top: 10px;" :model="formPopState" name="basic" autocomplete="off">
        <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ offset: 1 }" v-bind="validateInfos.tagname" label="标签名"
          name="tagname" :rules="rulesRef.tagname">
          <a-input v-model:value="formPopState.tagname" />
        </a-form-item>
        <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ offset: 1 }" v-bind="validateInfos.icon" label="小图标"
          name="icon" :rules="rulesRef.icon">
          <a-input v-model:value="formPopState.icon" />
        </a-form-item>
        <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ offset: 1 }" label="颜色" name="color">
          <color-picker pickerType="fk" useType="pure" lang="ZH-cn" format="hex" :disableHistory="true"
            :disableAlpha="true" gradientColor="linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)"
            v-model:pureColor="formPopState.color" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRaw, watch } from 'vue';
import { Form, message } from 'ant-design-vue';
import { addArticle, getArticleDetail } from '../../api/articles'
import { useRoute } from "vue-router";
import { InboxOutlined } from '@ant-design/icons-vue'
import type { UploadFile } from 'ant-design-vue'
import { postImgArray } from '../../api'
import { baseURL } from '../../api/urls'
const useForm = Form.useForm;
interface FormState {
  title: string;
  extraTitle: string;
  banner: string;
  git: string;
  tags: string[];
  content: string;
}
interface FormPopState {
  tagname: string;
  icon: string;
  color: string;
}
export default defineComponent({
  components: { InboxOutlined },
  setup() {
    const route = useRoute()
    const toolbars = [
      'bold',
      'underline',
      'italic',
      '-',
      'strikeThrough',
      'sub',
      'sup',
      'quote',
      'unorderedList',
      'orderedList',
      '-',
      'codeRow',
      'code',
      'link',
      'image',
      'table',
      'mermaid',
      'katex',
      '-',
      'revoke',
      'next',
      'save',
      '=',
      'pageFullscreen',
      // 'fullscreen',
      'preview',
      'htmlPreview',
      // 'catalog',
      // 'github'
    ]
    const optionList = ref([
      { value: 'vue' },
      { value: 'react' }
    ])
    const formState = reactive<FormState>({
      title: '',
      extraTitle: '',
      banner: '',
      git: '',
      tags: [],
      content: ''
    });
    const formPopState = reactive<FormPopState>({
      tagname: '',
      icon: '',
      color: '#ff0000'
    });
    const rulesRef = reactive({
      tagname: [{ required: true, message: '请输入标签名!' }],
      icon: [{ required: true, message: '请输入小图标!' }]
    });
    const { resetFields, validate, validateInfos } = useForm(formPopState, rulesRef);
    const visible = ref<boolean>(false);
    const visibleUpload = ref<boolean>(false);
    const fileList = ref<UploadFile[]>([])
    const showModal = () => {
      visible.value = true;
    };
    const showModalUpload = () => {
      visibleUpload.value = true
    }
    const handleCancel = () => {
      visible.value = false
      modalCloseBack()
    }
    const handleCloseUpload = () => {
      visibleUpload.value = false
    }
    const modalCloseBack = () => {
      formPopState.tagname = ''
      formPopState.icon = ''
      formPopState.color = '#ff0000'
      resetFields()
    }
    const handleOk = () => {
      validate().then(() => {
        console.log(toRaw(formPopState))
        visible.value = false
        modalCloseBack()
      }).catch(err => {
        console.log('error', err);
      })
    }
    const handleChange = (value: string[]) => {
      console.log(`selected====`, value);
    };
    const getEditorHtml = (html: string) => {
      console.log('html===', html)
    }
    const onSubmit = (values: any) => {
      console.log('Success:', values);
      const userinfoStr = localStorage.getItem('userinfo')
      let author = ''
      if (userinfoStr) {
        author = JSON.parse(userinfoStr).username
      }
      const params = {
        id: route.params.id || '',
        title: values.title,
        author: author,
        extra_title: values.extraTitle,
        banner: values.banner,
        tags: values.tags.join(','),
        git: values.git,
        content: values.content
      }
      addArticle(params).then((res: any) => {
        console.log('res==', res)
        if (res.code === 0) {
          message.success(res.message)
          formState.title = ''
          formState.extraTitle = ''
          formState.banner = ''
          formState.git = ''
          formState.tags = []
          formState.content = ''
        } else if (typeof res.message === 'object') {
          message.error(res.message && res.message.sqlMessage)
        } else {
          message.error(res.message)
        }
      })
    };
    const getArticleById = (id: string | string[]) => {
      getArticleDetail({ id }).then((res: any) => {
        console.log(res)
        if (res.code === 0) {
          formState.title = res.data.title
          formState.extraTitle = res.data.extra_title
          formState.banner = res.data.banner
          formState.git = res.data.git
          formState.tags = res.data.tags.split(',')
          formState.content = res.data.content
        } else if (typeof res.message === 'object') {
          message.error(res.message && res.message.sqlMessage)
        } else {
          message.error(res.message)
        }
      })
    }
    const onSubmitFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo.values.tags.join(','));
    };
    const customRequest = (options: any) => {
      console.log('options===',fileList.value)
      const formData = new FormData()
      formData.append("file", options.file)
      postImgArray(formData).then((res: any) => {
        if (Number(res.code) === 0) {
          message.success('上传成功');
          // 返回地址 回填到输入框
          formState.banner = `${baseURL}${res.data[0].filename}` || ''
          fileList.value = []
          visibleUpload.value = false
        } else {
          message.error(res.message);
        }
      })
    }
    watch(() => route.params.id, (val, oldval) => {
      if (route.name === 'articleCreate' && val !== oldval) {
        location.reload()
      }
    })
    onMounted(() => {
      if (route.params.id) {
        getArticleById(route.params.id)
      }
    })
    return {
      formState,
      formPopState,
      rulesRef,
      optionList,
      toolbars,
      visible,
      visibleUpload,
      fileList,
      baseURL,
      onSubmit,
      onSubmitFailed,
      resetFields,
      validate,
      validateInfos,
      handleChange,
      showModal,
      showModalUpload,
      handleOk,
      handleCancel,
      handleCloseUpload,
      modalCloseBack,
      getArticleById,
      getEditorHtml,
      customRequest
    };
  },
});
</script>