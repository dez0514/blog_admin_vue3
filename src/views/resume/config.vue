<template>
  <div style="padding: 0 20px;">
    <a-form style="margin-top: 10px;" :model="formState" name="basic" autocomplete="off">
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="名字" name="name"
        :rules="[{ required: true, message: '请输入名字!' }]">
        <a-input v-model:value="formState.name" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="生日" name="birthday">
        <a-input v-model:value="formState.birthday" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="头像" name="avatar">
        <a-input v-model:value="formState.avatar" allowClear />
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
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="技能" name="skills">
        <a-input v-model:value="formState.skills" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="地址" name="location">
        <a-input v-model:value="formState.location" allowClear />
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
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="自我评价" name="extra">
        <a-input v-model:value="formState.extra" allowClear />
      </a-form-item>
      <a-form-item :label-col="{ span: 2 }" :wrapper-col="{ offset: 1, span: 14 }" label="绑定项目" name="projects"
        :rules="[{ required: true, message: '请选择项目!' }]">
        <a-select v-model:value="formState.projects" mode="multiple"
          placeholder="请选择项目" :options="projectsList" allowClear>
        </a-select>
      </a-form-item>
      <a-form-item style="margin-bottom: 0; padding-bottom: 20px;" :wrapper-col="{ offset: 3, span: 14 }">
        <a-button type="primary" html-type="submit" @click="submitForm">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, inject } from 'vue';
import { getAllProjects } from '../../api/project'
import { saveResume, getResume } from '../../api/resume'
const message: any = inject('$message')
interface optItem {
  label: string;
  value: string;
}
interface formItem {
  name: string;
  birthday: string;
  avatar: string;
  gendar: string;
  school: string;
  skills: string;
  location: string;
  profession: string;
  graduationDate: string;
  blog: string;
  github: string;
  phone: string;
  email: string;
  wechat: string;
  qq: string;
  job: string;
  extra: string;
  projects: string[] | number[]
}
const gendarList = [
  { label: '男', value: '男' },
  { label: '女', value: '女' }
]
const projectsList = ref<optItem[]>([])
const formState = reactive<formItem>({
  name: '',
  birthday: '',
  avatar: '',
  gendar: '',
  school: '',
  skills: '',
  location: '',
  profession: '',
  graduationDate: '',
  blog: '',
  github: '',
  phone: '',
  email: '',
  wechat: '',
  qq: '',
  job: '',
  extra: '',
  projects: []
})
const getResumeData = () => {
  getResume().then((res: any) => {
    if(res.code === 0) {
      Object.keys(formState).forEach(item => {
        if(item !== 'projects') {
          formState[item as keyof formItem] = res.data && res.data[item] || ''
        } else {
          formState[item as keyof formItem] = res.data && res.data.projectList.map((inner: any) => inner.companyId)
        }
      })
    } else {
      message.error(res.message)
    }
  })
}
const getProjects = () => {
  getAllProjects().then((res: any) => {
    if(res.code === 0) {
      projectsList.value = res.data.map((item: any) => {
        return {
          label: item.name,
          value: item.id
        }
      })
    } else {
      message.error(res.message)
    }
  })
}
const submitForm = () => {
  const params = {
    name: formState.name,
    birthday: formState.birthday,
    avatar: formState.avatar,
    gendar: formState.gendar,
    school: formState.school,
    skills: formState.skills,
    location: formState.location,
    profession: formState.profession,
    graduationDate: formState.graduationDate,
    blog: formState.blog,
    github: formState.github,
    phone: formState.phone,
    email: formState.email,
    wechat: formState.wechat,
    qq: formState.qq,
    job: formState.job,
    extra: formState.extra,
    projectIds: formState.projects.join(',')
  }
  saveResume(params).then((res: any) => {
    if(res.code === 0) {
      message.success('保存成功')
    } else {
      message.error(res.message)
    }
  })
}
onMounted(() => {
  getResumeData()
  getProjects()
})
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