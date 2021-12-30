<template>
    <div class="container">
        <h2 style="text-align: center;color: #1890ff;">博客管理系统</h2>
        <a-form
            style="margin-top: 20px;"
            :model="formState"
            name="basic"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
            <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
                <a-input placeholder="用户名" v-model:value="formState.username">
                    <template #prefix>
                        <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
                <a-input-password
                    placeholder="密码"
                    v-model:value="formState.password"
                    autocomplete="off"
                >
                    <template #prefix>
                        <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码!' }]">
                <a-input
                    placeholder="验证码"
                    v-model:value="formState.code"
                    style="width: calc(100% - 100px);margin-right: 12px;"
                >
                    <template #prefix>
                        <CodeOutlined style="color: rgba(0, 0, 0, 0.25)" />
                    </template>
                </a-input>
                <verify-code style="width: 88px;height: 32px;" @emitCode="getCode"></verify-code>
            </a-form-item>
            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                    block
                    :disabled="formState.username === '' || formState.password === '' || formState.code === ''"
                    @click="handleSubmit"
                >登录</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import {
    UserOutlined,
    LockOutlined,
    CodeOutlined
} from "@ant-design/icons-vue";
import verifyCode from '../../components/verifyCode.vue'
import { useRouter } from 'vue-router';
interface FormState {
    username: string;
    password: string;
    code: string;
}
export default defineComponent({
    components: {
        UserOutlined,
        LockOutlined,
        CodeOutlined,
        verifyCode
    },
    setup() {
        const router = useRouter()
        const formState = reactive<FormState>({
            username: '',
            password: '',
            code: ''
        });
        const imgCode = ref<string>('')
        const getCode = (code: string) => {
            console.log('code===', code)
            imgCode.value = code
        }
        const handleSubmit = () => {
            if (formState.username === 'zwd' && formState.password === '123456' && formState.code === imgCode.value) {
                localStorage.setItem('isLogin', 'true')
                router.replace('/')
            }
        }
        const onFinish = (values: any) => {
            console.log('Success:', values);
        };
        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };
        return {
            formState,
            onFinish,
            onFinishFailed,
            getCode,
            handleSubmit
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
    padding: 20px 20px 6px;
    width: 400px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
</style>

