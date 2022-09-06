<template>
  <div class="container">
    <h2 style="text-align: center;color: #1890ff;">博客管理系统</h2>
    <a-form ref="formref" style="margin-top: 20px;" :model="formState">
      <a-form-item name="username" :rules="rulesRef.username">
        <a-input
          placeholder="用户名"
          v-model:value="formState.username"
          @pressEnter="handlePressEnter('pwdref')"
          allow-clear
          autocomplete="on"
          style="height: 44px"
        >
          <template #prefix>
            <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password" :rules="rulesRef.password">
        <a-input-password
          ref="pwdref"
          placeholder="密码"
          v-model:value="formState.password"
          autocomplete="on"
          @pressEnter="handlePressEnter('coderef')"
          allow-clear
          style="height: 44px"
        >
          <template #prefix>
            <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="code" :rules="rulesRef.code">
        <a-input
          ref="coderef"
          placeholder="验证码"
          v-model:value="formState.code"
          style="width: calc(100% - 100px);margin-right: 12px;height: 44px;"
          @pressEnter="handlePressEnter('formref')"
          allow-clear
          autocomplete="off"
        >
          <template #prefix>
            <CodeOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input>
        <verify-code style="width: 88px;height: 44px;" @emitCode="getCode"></verify-code>
      </a-form-item>
      <a-form-item>
        <verify-drag @emitVerifyDrag="getDragVerify"></verify-drag>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          block
          :disabled="formState.username === '' || formState.password === '' || formState.code === '' || !formState.verifydrag"
          :loading="submitLoad"
          @click="handleSubmit"
          style="height: 44px"
        >登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, reactive, ref, toRaw } from 'vue';
import {
  UserOutlined,
  LockOutlined,
  CodeOutlined
} from "@ant-design/icons-vue";
import verifyCode from './components/verifyCode.vue'
import verifyDrag from './components/verifyDrag.vue'
import { useRouter } from 'vue-router';
import { Form } from 'ant-design-vue';
import { login } from '../../api/user'
const useForm = Form.useForm;
interface FormState {
  username: string,
  password: string,
  code: string,
  verifydrag: boolean
}
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    CodeOutlined,
    verifyCode,
    verifyDrag
  },
  setup() {
    const message: any = inject('$message')
    const router = useRouter()
    const formState = reactive<FormState>({
      username: '',
      password: '',
      code: '',
      verifydrag: false
    });
    const rulesRef = reactive({
      username: [
        {
          required: true,
          message: '请输入用户名',
        }
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
        }
      ],
      code: [
        {
          required: true,
          message: '请输入验证码',
        },
        {
          max: 4,
          message: '格式有误',
          trigger: 'blur',
        },
      ],
    });
    const submitLoad = ref<boolean>(false)
    const imgCode = ref<string>('')
    const getCode = (code: string) => {
      imgCode.value = code
    }
    const getDragVerify = (flag: boolean) => {
      formState.verifydrag = flag
    }
    const { validate } = useForm(formState, rulesRef);
    const handleLogin = () => {
      const params = {
        username: formState.username,
        password: formState.password
      }
      login(params).then(res => {
        console.log(res)
      })
    }
    const handleSubmit = () => {
      validate().then(() => {
        // console.log(toRaw(formState));
        // if (formState.username !== 'zwd' || formState.password !== '123456') {
        //   message.error('用户名或密码不正确');
        //   return
        // }
        if (formState.code.toLowerCase() !== imgCode.value.toLowerCase()) {
          message.error('验证码不正确');
          return
        }
        if (!formState.verifydrag) {
          message.error('滑块验证未通过');
          return
        }
        // submitLoad.value = true
        // setTimeout(() => {
        //   submitLoad.value = false
        //   localStorage.setItem('isLogin', 'true')
        //   localStorage.setItem('userinfo', JSON.stringify({ username: formState.username }))
        //   router.replace('/')
        // }, 500)
        handleLogin()
      }).catch(err => {
        submitLoad.value = false
        message.error('登录失败');
      });
    }
    const pwdref = ref(null as HTMLInputElement | null)
    const coderef = ref(null as HTMLInputElement | null)
    const handlePressEnter = (typeRef: string) => {
      if (typeRef === 'pwdref') {
        pwdref.value?.focus()
      } else if (typeRef === 'coderef') {
        coderef.value?.focus()
      } else if (typeRef === 'formref') {
        handleSubmit()
      }
    }
    return {
      pwdref,
      coderef,
      formState,
      rulesRef,
      submitLoad,
      handleSubmit,
      getCode,
      getDragVerify,
      handlePressEnter,
      handleLogin
    };
  },
});
</script>
<style lang="scss" scoped>
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

