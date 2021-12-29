<template>
    <a-form
        style="margin-top: 10px;"
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
    >
        <a-form-item
            :label-col="{ span: 3 }"
            :wrapper-col="{ offset: 1, span: 14 }"
            label="标题"
            name="title"
            :rules="[{ required: true, message: '请输入标题!' }]"
        >
            <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item
            :label-col="{ span: 3 }"
            :wrapper-col="{ offset: 1, span: 14 }"
            label="小标题"
            name="extraTitle"
            :rules="[{ required: true, message: '请输入小标题!' }]"
        >
            <a-input v-model:value="formState.extraTitle" />
        </a-form-item>
        <a-form-item
            :label-col="{ span: 3 }"
            :wrapper-col="{ offset: 1, span: 14 }"
            label="封面地址"
            name="banner"
            :rules="[{ required: true, message: '请输入封面地址!' }]"
        >
            <a-input v-model:value="formState.banner" />
        </a-form-item>
        <a-form-item
            :label-col="{ span: 3 }"
            :wrapper-col="{ offset: 1, span: 14 }"
            label="git地址"
            name="git"
            :rules="[{ required: true, message: '请输入git地址!' }]"
        >
            <a-input v-model:value="formState.git" />
        </a-form-item>
        <a-form-item
            :label-col="{ span: 3 }"
            :wrapper-col="{ offset: 1, span: 14 }"
            label="标签"
            name="tags"
            :rules="[{ required: true, message: '请选择标签!' }]"
        >
            <a-select
                v-model:value="formState.tags"
                mode="multiple"
                style="width: calc(100% - 100px);margin-right: 12px;"
                placeholder="请选择标签"
                :options="optionList"
                @change="handleChange"
            ></a-select>
            <a-button type="primary" @click="showModal">新增标签</a-button>
        </a-form-item>
        <a-form-item
            :label-col="{ span: 3 }"
            :wrapper-col="{ offset: 1, span: 14 }"
            label="内容"
            name="content"
            :rules="[{ required: true, message: '请输入内容!' }]"
        >
            <md-editor v-model="formState.content" :toolbars="toolbars" :style="{ height: '250px' }" />
        </a-form-item>
        <a-form-item style="margin-bottom: 0;" :wrapper-col="{ offset: 4, span: 14 }">
            <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
    </a-form>
    <a-modal v-model:visible="visible" title="新增标签" @ok="handleOk">
        <a-form
            style="margin-top: 10px;"
            :model="formPopState"
            name="basic"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
            <a-form-item
                :label-col="{ span: 3 }"
                :wrapper-col="{ offset: 1 }"
                label="标签名"
                name="tagname"
                :rules="[{ required: true, message: '请输入标签名!' }]"
            >
                <a-input v-model:value="formPopState.tagname" />
            </a-form-item>
            <a-form-item
                :label-col="{ span: 3 }"
                :wrapper-col="{ offset: 1 }"
                label="小图标"
                name="icon"
                :rules="[{ required: true, message: '请输入小图标!' }]"
            >
                <a-input v-model:value="formPopState.icon" />
            </a-form-item>
            <!-- <a-form-item
                :label-col="{ span: 3 }"
                :wrapper-col="{ offset: 1 }"
                label="颜色"
                name="color"
                :rules="[{ required: true, message: '请选择颜色!' }]"
            >
                <color-picker
                    pickerType="chrome"
                    :roundHistory="true"
                    v-model:pureColor="formPopState.color"
                    v-model:gradientColor="formPopState.gradientColor"
                />
            </a-form-item> -->
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
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
    gradientColor: string;
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
            color: '#ff0000',
            gradientColor: 'linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)'
        });
        const visible = ref<boolean>(false);
        const showModal = () => {
            visible.value = true;
        };
        const handleOk = (e: MouseEvent) => {
            console.log(e);
            visible.value = false;
        };
        const handleChange = (value: string[]) => {
            console.log(`selected ${value}`);
        };
        const onFinish = (values: any) => {
            console.log('Success:', values);
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };
        return {
            formState,
            formPopState,
            optionList,
            toolbars,
            visible,
            onFinish,
            onFinishFailed,
            handleChange,
            showModal,
            handleOk,
        };
    },
});
</script>