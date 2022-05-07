<template>
  <div style="padding: 0 20px;">
    <a-form style="margin-top: 10px;" :model="formState" name="basic" autocomplete="off" @finish="onSubmit"
      @finishFailed="onSubmitFailed">
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="标题" name="title"
        :rules="[{ required: true, message: '请输入标题!' }]">
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="小标题" name="extraTitle"
        :rules="[{ required: true, message: '请输入小标题!' }]">
        <a-input v-model:value="formState.extraTitle" />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="封面地址" name="banner">
        <a-input v-model:value="formState.banner" />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="git地址" name="git">
        <a-input v-model:value="formState.git" />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="标签" name="tags"
        :rules="[{ required: true, message: '请选择标签!' }]">
        <a-select v-model:value="formState.tags" mode="multiple" style="width: calc(100% - 100px);margin-right: 12px;"
          placeholder="请选择标签" :options="optionList" @change="handleChange"></a-select>
        <a-button type="primary" @click="showModal">新增标签</a-button>
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 18 }" label="内容" name="content"
        :rules="[{ required: true, message: '请输入内容!' }]">
        <md-editor v-model="formState.content" :toolbars="toolbars" :style="{ height: '440px' }" />
      </a-form-item>
      <a-form-item style="margin-bottom: 0;" :wrapper-col="{ offset: 3, span: 14 }">
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
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
          <color-picker pickerType="fk"
            useType="pure"
            lang="ZH-cn"
            format="hex"
            :disableHistory="true"
            :disableAlpha="true"
            gradientColor="linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)"
            v-model:pureColor="formPopState.color"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from 'vue';
import { Form } from 'ant-design-vue';
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
  setup() {
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
    const showModal = () => {
      visible.value = true;
    };
    const handleCancel = () => {
      visible.value = false
      modalCloseBack()
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
      console.log(`selected ${value}`);
    };
    const onSubmit = (values: any) => {
      console.log('Success:', values);
    };
    const onSubmitFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    return {
      formState,
      formPopState,
      rulesRef,
      optionList,
      toolbars,
      visible,
      onSubmit,
      onSubmitFailed,
      resetFields,
      validate,
      validateInfos,
      handleChange,
      showModal,
      handleOk,
      handleCancel,
      modalCloseBack
    };
  },
});
</script>