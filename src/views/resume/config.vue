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
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="电话" name="phone"
        :rules="[{ required: true, message: '请输入电话!' }]">
        <a-input v-model:value="formState.phone" allowClear />
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
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="应聘岗位" name="job"
        :rules="[{ required: true, message: '请输入应聘岗位!' }]">
        <a-input v-model:value="formState.job" allowClear />
      </a-form-item>
    </a-form>
    <div style="font-weight: 600">选择项目：</div>
    <a-form>
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="submitForm">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
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
  phone: '',
  email: '',
  wechat: '',
  qq: '',
  job: ''
})

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