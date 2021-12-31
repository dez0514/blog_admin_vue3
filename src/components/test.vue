<template>
    <div>
        <div ref="box">123</div>
        <div>{{ testprops }}</div>
        <a-button @click="handleChangeTest">点击</a-button>
    </div>
</template>

<!-- <script setup lang="ts">
import { onMounted,ref } from "vue";
defineProps({
    testprops: String
})
const a = ref<string>('aa')
const emit = defineEmits<{ (e: "changeProps", value: string): void }>()
const handleChangeTest = () => {
    emit('changeProps', 'test add1')
}
const box = ref(null)
// console.log('box===',box)
// onMounted(() => {
//     console.log('box1===',box) // 有
// })
defineExpose({
  a
})
</script> -->

<script lang="ts">
import { defineComponent,onMounted,ref } from "vue";
export default defineComponent({
    props:{
        testprops: {
            type: String,
            default: 'test'
        }
    },
    setup(props,context) {
        const handleChangeTest = () => {
            context.emit('changeProps', 'test add1')
        }
        const box = ref(null)
        console.log('box2===',box) // 有
        const a = ref<string>('aa')
        context.expose({
            a
        })
        onMounted(()=>{
            console.log('box3===',box) // 有
        })
        return {
            handleChangeTest
        }
    }
})
</script>