<template>
  <div style="padding: 0 20px;">
    <div style="font-weight: 600">基本信息：</div>
    <a-form style="margin-top: 10px;" :model="formState" name="basic" autocomplete="off">
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="名字" name="name"
        :rules="[{ required: true, message: '请输入名字!' }]">
        <a-input v-model:value="formState.name" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="性别" name="gendar"
        :rules="[{ required: true, message: '请选择性别!' }]">
        <a-select v-model:value="formState.gendar" placeholder="请选择标签" :options="gendarList">
        </a-select>
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="毕业院校" name="school"
        :rules="[{ required: true, message: '请输入毕业院校!' }]">
        <a-input v-model:value="formState.school" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="专业">
        <a-input v-model:value="formState.profession" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="毕业时间">
        <a-input v-model:value="formState.graduationDate" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="博客">
        <a-input v-model:value="formState.blog" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="GitHub">
        <a-input v-model:value="formState.github" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="电话" name="cell"
        :rules="[{ required: true, message: '请输入电话!' }]">
        <a-input v-model:value="formState.cell" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="邮箱">
        <a-input v-model:value="formState.email" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="微信">
        <a-input v-model:value="formState.wechat" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="QQ">
        <a-input v-model:value="formState.qq" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="应聘岗位" name="job"
        :rules="[{ required: true, message: '请输入应聘岗位!' }]">
        <a-input v-model:value="formState.job" allowClear />
      </a-form-item>
    </a-form>
    <div style="font-weight: 600">工作经历：</div>
    <a-form style="margin-top: 10px;" ref="formRef" :model="dynamicValidateForm" name="dynamic" v-bind="formItemLayoutWithOutLabel">
      <a-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key" 
        v-bind="formItemLayoutWithOutLabel"
        :name="['domains', index, 'value']"
        :rules="{
          required: true,
          message: 'can not be null',
          trigger: 'blur',
        }">
        <div class="domain-item-wrap">
          <div class="domain-item">
            <a-form-item label="公司名称" v-bind="formItemLayout">
              <a-input v-model:value="domain.value" placeholder="please input domain" allowClear />
            </a-form-item>
            <a-form-item label="时间" v-bind="formItemLayout">
              <a-input v-model:value="domain.value" placeholder="please input domain" allowClear />
            </a-form-item>
          </div>
          <MinusCircleOutlined v-if="dynamicValidateForm.domains.length > 1 && index > 0" class="dynamic-delete-button"
          @click="removeDomain(domain)" />
        </div>
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 100%" @click="addDomain">
          <PlusOutlined />Add Company
        </a-button>
      </a-form-item>
    </a-form>
    <div style="font-weight: 600">项目经验：</div>
    <a-form style="margin-top: 10px;" ref="formRef" :model="dynamicValidateForm" name="dynamic" v-bind="formItemLayoutWithOutLabel">
      <a-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key" 
        v-bind="formItemLayoutWithOutLabel"
        :name="['domains', index, 'value']"
        :rules="{
          required: true,
          message: 'can not be null',
          trigger: 'blur',
        }">
        <div class="domain-item-wrap">
          <div class="domain-item">
            <a-form-item label="公司名称" v-bind="formItemLayout">
              <a-input v-model:value="domain.value" placeholder="please input domain" allowClear />
            </a-form-item>
            <a-form-item label="时间" v-bind="formItemLayout">
              <a-input v-model:value="domain.value" placeholder="please input domain" allowClear />
            </a-form-item>
          </div>
          <MinusCircleOutlined v-if="dynamicValidateForm.domains.length > 1 && index > 0" class="dynamic-delete-button"
          @click="removeDomain(domain)" />
        </div>
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 100%" @click="addDomain">
          <PlusOutlined />Add Project
        </a-button>
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="primary" html-type="submit" @click="submitForm">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
interface Domain {
  value: string;
  key: number;
}
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    offset: 1,
    span: 20
  }
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    offset: 3,
    span: 14
  },
};
const formRef = ref<FormInstance>();
const gendarList = [
  { label: '男', value: '男' },
  { label: '女', value: '女' }
]
const formState = reactive({
  name: '',
  gendar: '',
  school: '',
  profession: '',
  graduationDate: '',
  blog: '',
  github: '',
  cell: '',
  email: '',
  wechat: '',
  qq: '',
  job: ''
})
const dynamicValidateForm = reactive<{ domains: Domain[] }>({
  domains: []
})
const removeDomain = (item: Domain) => {
  let index = dynamicValidateForm.domains.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.domains.splice(index, 1)
  }
}
const addDomain = () => {
  dynamicValidateForm.domains.push({
    value: '',
    key: Date.now()
  })
}
const submitForm = () => {

}
</script>
<style lang="scss" scoped>
.domain-item-wrap {
  position: relative;
}
.domain-item {
  padding: 24px 10px 0 10px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}
.dynamic-delete-button {
  position: absolute;
  top: 5px;
  right: -34px;
  cursor: pointer;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
</style>