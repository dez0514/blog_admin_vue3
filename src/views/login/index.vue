<template>
    <div class="container">
        <h2 style="text-align: center;color: #1890ff;">博客管理系统</h2>
        <a-form
            ref="formref"
            style="margin-top: 20px;"
            :model="formState"
            name="basic"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
            <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
                <a-input placeholder="用户名" v-model:value="formState.username" @pressEnter="handlePressEnter('pwdref')" allow-clear>
                    <template #prefix>
                        <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
                <a-input-password
                    ref="pwdref"
                    placeholder="密码"
                    v-model:value="formState.password"
                    autocomplete="off"
                    @pressEnter="handlePressEnter('coderef')"
                    allow-clear
                >
                    <template #prefix>
                        <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码!' }]">
                <a-input
                    ref="coderef"
                    placeholder="验证码"
                    v-model:value="formState.code"
                    style="width: calc(100% - 100px);margin-right: 12px;"
                    @pressEnter="handlePressEnter('formref')"
                    allow-clear
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
                >登录</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import {
    UserOutlined,
    LockOutlined,
    CodeOutlined
} from "@ant-design/icons-vue";
import verifyCode from '../../components/verifyCode.vue'
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
// import { notification } from 'ant-design-vue';
// const notice: any = notification
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
            imgCode.value = code
        }
        // const openNotificationWithIcon = (type: string, content: string) => {
            // notice[type]({ message: '提示',description: content });
        // }
        const onFinish = (values: FormState) => {
            if(values.username !== 'zwd' || values.password !== '123456') {
                // openNotificationWithIcon('error', '用户名或密码不正确')
                message.error('用户名或密码不正确');
                return
            }
            if(values.code.toLowerCase() !== imgCode.value.toLowerCase()) {
                message.error('验证码不正确');
                // openNotificationWithIcon('error', '验证码不正确')
                return
            }
            localStorage.setItem('isLogin', 'true')
            router.replace('/')
        };
        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };
        const pwdref = ref(null as HTMLInputElement | null)
        const coderef = ref(null as HTMLInputElement | null)
        const formref = ref(null as HTMLFormElement | null)
        const handlePressEnter = (typeRef: string ) => {
            if(typeRef === 'pwdref') {
                pwdref.value?.focus()
            } else if(typeRef === 'coderef') {
                coderef.value?.focus()
            } else if(typeRef === 'formref') {
                formref.value?.submit()
            }
        }
        return {
            pwdref,
            coderef,
            formState,
            onFinish,
            onFinishFailed,
            getCode,
            handlePressEnter
            // openNotificationWithIcon
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

