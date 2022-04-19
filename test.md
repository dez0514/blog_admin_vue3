### vue3写法要点
###### <script setup> 函数式 与 export default defineComponent({ setup(){} }) | export default { setup(){} }
1. defineXXX方法只能用于函数式，例如：defineEmits,defineProps,defineExpose
2. 后两者写法差不多一个意思，支持生命周期，props 和 emit等可以借助 setup(props, {attrs,slots,emits,expose}){},注意最后要return
###### ref 可以定义响应式数据，也可以用来获取dom, 这里记录获取dom的坑
1. 子组件 和 普通标签 有点区别。 

```
<test ref="testbox"></test>
<div ref="login"></div>
```
调用时：

```
setup() {
    const testbox = ref<InstanceType<typeof test> | null>(null) // ts 获取子组件的类型
    const login = ref(null as HTMLDivElement | null) // 标签类型，后面使用时，可能为null会提示不能去里面的属性，要做判断或者使用'?'取，例如 testbox.value?.a
    onMounted(()=> {
        console.log('test==',testbox.value?.a) // a 需要在 test组件中 利用 defineExpose 或者 expose 暴露出来
        console.log('login==',login.value)
    })
    return {
        testbox,
        login
    }
}

```
```
// defineEmits 用法
const emit = defineEmits<{ (e: "emitCode", code: string): void }>();
emit('emitCode', code)
```   
2. ts 使用中括号时
```
const obj = ref<{a:string}>({a:'abc'})
const test = (type: keyof {a:string}) => {
    console.log(obj.value[type])
}
```
3. 获取组件类型: InstanceType<typeof component_name>

### 事件总线用 mitt
### 状态管理vuex 或者 pinia
vuex:
```
// 注意： main.ts 中注入
import { useStore } from "vuex"
const store = useStore()
store.dispatch('updateCommentsAction', 25)

```

pinia:
```
// main.ts 注入
import { createPinia } from 'pinia'
app.use(createPinia())
// .vue文件中使用
import { todoStore } from '../../store/pinia'
import { storeToRefs } from 'pinia'
const store = todoStore()
const { todos,filter,nextId } = storeToRefs(store)
const testFuc = () => {
  console.log(store)
  store.addTodo('test1')
}
```
### ui 框架的换肤 vite插件
### 没有name的情况下，怎么写递归组件，keep-alive如何匹配? 
答：会使用文件名作为name，参考：[https://www.cnblogs.com/guangzan/p/15021560.html#name-的自动推导](https://www.cnblogs.com/guangzan/p/15021560.html#name-的自动推导)
### 路由权限设计
### 布局，布局切换
