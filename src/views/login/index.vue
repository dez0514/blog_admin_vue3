<template>
  <div class="login-page">
    <div class="container">
      <h2 style="text-align: center;color: #1890ff;">博客管理系统</h2>
      <a-tabs v-model:activeKey="activeTab" @change="changeTab">
        <a-tab-pane key="login" :tab="showReg ? '登录' : ''">
          <a-form ref="formref" :model="formState">
            <a-form-item name="username" :rules="rulesRef.username">
              <a-input placeholder="用户名" v-model:value="formState.username" @pressEnter="handlePressEnter('pwdref')"
                allow-clear autocomplete="on" style="height: 44px">
                <template #prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="password" :rules="rulesRef.password">
              <a-input-password ref="pwdref" placeholder="密码" v-model:value="formState.password" autocomplete="on"
                @pressEnter="handlePressEnter('coderef')" allow-clear style="height: 44px">
                <template #prefix>
                  <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item name="code" :rules="rulesRef.code">
              <a-input ref="coderef" placeholder="验证码" v-model:value="formState.code"
                style="width: calc(100% - 100px);margin-right: 12px;height: 44px;"
                @pressEnter="handlePressEnter('formref')" allow-clear autocomplete="off">
                <template #prefix>
                  <CodeOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
              <verify-code ref="verifycoderef" style="width: 88px;height: 44px;" @emitCode="getCode"></verify-code>
            </a-form-item>
            <a-form-item>
              <verify-drag ref="verifydragref" @emitVerifyDrag="getDragVerify"></verify-drag>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" block
                :disabled="formState.username === '' || formState.password === '' || formState.code === '' || !formState.verifydrag"
                :loading="submitLoad" @click="handleSubmit" style="height: 44px">登录</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane v-if="showReg" key="register" tab="注册">
          <a-form ref="regformref" :model="registerFormState">
            <a-form-item name="username" :rules="rulesRegRef.username">
              <a-input placeholder="用户名" v-model:value="registerFormState.username"
                @pressEnter="handlePressEnter('regpwdref')" allow-clear autocomplete="new-password"
                style="height: 44px">
                <template #prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="password" :rules="rulesRegRef.password">
              <a-input-password ref="regpwdref" placeholder="密码" v-model:value="registerFormState.password"
                autocomplete="new-password" @pressEnter="handlePressEnter('regformref')" allow-clear
                style="height: 44px">
                <template #prefix>
                  <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" block
                :disabled="registerFormState.username === '' || registerFormState.password === ''"
                :loading="submitRegLoad" @click="handleRegSubmit" style="height: 44px">注册</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
    <verifyJigsaw v-if="jigsawShow" v-model:visible="jigsawShow" @verifyResult="jigsawVerify" />
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, reactive, ref } from 'vue';
import {
  UserOutlined,
  LockOutlined,
  CodeOutlined
} from "@ant-design/icons-vue";
import verifyCode from './components/verifyCode.vue'
import verifyDrag from './components/verifyDrag.vue'
import verifyJigsaw from './components/verifyJigsaw.vue'
import { useRouter } from 'vue-router';
import { Form } from 'ant-design-vue';
import { login, register } from '../../api/user'
const showReg = ref<boolean>(false)
const useForm = Form.useForm;
interface FormState {
  username: string;
  password: string;
  code: string;
  verifydrag: boolean;
  jigsaw: boolean;
}
interface regFormState {
  username: string;
  password: string;
}
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    CodeOutlined,
    verifyCode,
    verifyDrag,
    verifyJigsaw
  },
  setup() {
    const message: any = inject('$message')
    const router = useRouter()
    const formState = reactive<FormState>({
      username: '',
      password: '',
      code: '',
      verifydrag: false,
      jigsaw: false
    });
    const registerFormState = reactive<regFormState>({
      username: '',
      password: '',
    })
    const verifycoderef = ref<InstanceType<typeof verifyCode> | null>(null)
    const verifydragref = ref<InstanceType<typeof verifyDrag> | null>(null)
    const activeTab = ref<string>('login')
    const jigsawShow = ref<boolean>(false)
    const rulesRef = reactive({
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }
      ],
      code: [
        {
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        },
        {
          max: 4,
          message: '格式有误',
          trigger: 'blur'
        },
      ],
    });
    const rulesRegRef = reactive({
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }
      ]
    });
    const submitLoad = ref<boolean>(false)
    const submitRegLoad = ref<boolean>(false)
    const imgCode = ref<string>('')
    const getCode = (code: string) => {
      imgCode.value = code
    }
    const getDragVerify = (flag: boolean) => {
      formState.verifydrag = flag
    }
    const jigsawVerify = (flag: boolean) => {
      formState.jigsaw = flag
      if(flag) {
        // 验证成功，自动走登录接口
        submitLoad.value = true
        handleLogin()
      }
    }
    const handleLogin = () => {
      const params = {
        username: formState.username,
        password: formState.password
      }
      login(params).then((res: any) => {
        console.log(res)
        submitLoad.value = false
        if (Number(res.code) === 0) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo))
          router.replace('/')
        } else {
          message.error(res.message)
          // 拼图验证回初始值
          formState.jigsaw = false
          // 验证码刷新，拖动验证重新验证
          verifycoderef.value?.handleDraw()
          verifydragref.value?.refreshInit()
        }
      }).catch(() => {
        submitLoad.value = false
        formState.jigsaw = false
        verifycoderef.value?.handleDraw()
        verifydragref.value?.refreshInit()
        message.error('登录失败！');
      })
    }
    const loginForm = useForm(formState, rulesRef);
    const handleSubmit = () => {
      loginForm.validate().then(() => {
        if (formState.code.toLowerCase() !== imgCode.value.toLowerCase()) {
          message.error('验证码不正确');
          return
        }
        if (!formState.verifydrag) {
          message.error('滑块验证未通过');
          return
        }
        if (!formState.jigsaw) {
          jigsawShow.value = true
        } else {
          submitLoad.value = true
          handleLogin()
        }
      }).catch(err => {
        submitLoad.value = false
        message.error('登录失败');
      });
    }
    const handleRegister = () => {
      const params = {
        username: registerFormState.username,
        password: registerFormState.password
      }
      register(params).then((res: any) => {
        submitRegLoad.value = false
        if (res.code === 0) {
          message.success(res.message)
        } else {
          message.error(res.message)
        }
      }).catch(() => {
        submitRegLoad.value = false
      })
    }
    const registerForm = useForm(registerFormState, rulesRegRef);
    const handleRegSubmit = () => {
      registerForm.validate().then((valid) => {
        console.log('valid==', valid)
        submitRegLoad.value = true
        handleRegister()
      }).catch(err => {
        console.log('valid err==', err)
        submitRegLoad.value = false
        message.error('注册失败');
      });
    }
    const pwdref = ref(null as HTMLInputElement | null)
    const coderef = ref(null as HTMLInputElement | null)
    const regpwdref = ref(null as HTMLInputElement | null)
    const handlePressEnter = (typeRef: string) => {
      if (typeRef === 'pwdref') {
        pwdref.value?.focus()
      } else if (typeRef === 'coderef') {
        coderef.value?.focus()
      } else if (typeRef === 'formref') {
        if (formState.code === '') {
          coderef.value?.blur()
          return
        }
        if (formState.code.toLowerCase() !== imgCode.value.toLowerCase()) {
          message.error('验证码不正确');
          return
        }
        if (!formState.verifydrag) {
          message.error('请验证滑块');
          return
        }
        handleSubmit()
      } else if (typeRef === 'regpwdref') {
        regpwdref.value?.focus()
      } else if (typeRef === 'regformref') {
        handleRegSubmit()
      }
    }
    const changeTab = (val: string) => {
      if (val === 'register') {
        registerForm.clearValidate(['username', 'password']) // 不生效
      } else if (val === 'login') {
        loginForm.clearValidate(['username', 'password', 'code']) // 不生效
      }
    }
    return {
      showReg,
      activeTab,
      pwdref,
      coderef,
      verifycoderef,
      verifydragref,
      formState,
      registerFormState,
      rulesRef,
      rulesRegRef,
      submitLoad,
      submitRegLoad,
      jigsawShow,
      handleSubmit,
      jigsawVerify,
      handleRegSubmit,
      getCode,
      getDragVerify,
      handlePressEnter,
      handleLogin,
      handleRegister,
      changeTab
    };
  },
});
</script>
<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100vh;
}
.container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 40px 6px;
  width: 440px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  user-select: none;
}

:deep(input:-internal-autofill-previewed),
:deep(input:-internal-autofill-selected) {
  transition: background-color 5000s ease-in-out 0s !important;
}
</style>

