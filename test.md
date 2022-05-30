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
```
// vuex.ts
import { createStore } from 'vuex'
import { Commit } from "vuex"
import { State } from '../types/store'

export default createStore({
  state: {
    comments: 0,
    typeId: 'user001',
    showName: true,
    count: 0,
    user: {
      name: 'joy',
      pwd: '123456'
    }
  },
  getters: {
    getId: (state: State) => state.typeId,
    getUser: (state: State) => state.user
  },
  mutations: {
    showUserName(state: State) {
      state.showName = false
    },
    updateCount(state: State) {
      state.count++
    },
    updateComments(state: State, payload: number) {
      state.comments = payload
    }
  },
  actions: {
    getUserList(context: { commit: Commit }) {
      context.commit('updateCount')
    },
    updateCommentsAction(context: { commit: Commit }, payload: number) {
      context.commit('updateComments', payload)
    }
  },
  modules: {

  }
})

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
参考方案： [https://mp.weixin.qq.com/s/VvmZdLP-ry0XIYCA5qd7bA](https://mp.weixin.qq.com/s/VvmZdLP-ry0XIYCA5qd7bA)
换肤主要分两部分：1.ui框架组件的换肤，通常ui框架会提供方案。 2.普通h5标签的换肤。
理想思路：定义css变量，局部样式时利用var(变量名)的方式给颜色，然后根据当前主题色给这个变量赋值。
此管理系统的颜色要求：
  1.header 和 sidebar 只各自分黑白版。黑板白字，白板黑字。
  2.内容区的元素需要换肤的部分设置背景色和字体色。部分不需要其他颜色的也是黑板白字，白板黑字
  3.此插件，黑板的table没解决。。
### 没有name的情况下，怎么写递归组件，keep-alive如何匹配? 
答：会使用文件名作为name，参考：[https://www.cnblogs.com/guangzan/p/15021560.html#name-的自动推导](https://www.cnblogs.com/guangzan/p/15021560.html#name-的自动推导)
### 路由权限设计
### 布局，布局切换

### form表单特殊情况，批量新增，新增时存在必填字段需要校验时。由于是批量，可能一次多行，每行需要校验的字段相同。
文档中 ‘动态增减嵌套字段’ 此处即类似为此特殊情况，from的里面套着个循环校验，多行，每行一或多个字段需要校验。文档中用 a-form 包裹 a-space 加 v-for。
同理引申一下，可能存在写法是 a-form 包裹一个 a-table, 也能套用文档此部分，但是提交时的确定按钮，往往不只有提交操作，可能还有其他操作，例如标签管理中的批量新增是在弹窗里，
确定按钮不仅有提交form的操作，校验通过时还要有关闭弹窗的操作，或者按钮loading的逻辑，此时就不好用 <a-button html-type="submit">提交</a-button> 方式提交。
1. 普通情况 还可以使用 useForm 方式来提交。（此中情况貌似困难，获取validate方法时 需要传入规则，此处不好定义循环中的规则）
2. 标签管理处用的 ref, 通过ref也能获取到validate方法。

### color-picker
文档：https://aesoper101.github.io/vue3-colorpicker/?path=/story/example-introduction--page
```
// 渐变色只能设置固定颜色与选中颜色渐变，有点局限。几乎可以不用它，直接写固定值，不传控制台会报错。
<color-picker
  pickerType="fk"
  useType="pure"
  lang="ZH-cn"
  format="hex"
  :disableHistory="true"
  :disableAlpha="true"
  v-model:pureColor="color"
  v-model:gradientColor="gradientColor"
/>
```

#### upload 组件多文件上传会多次触发接口和各阶段钩子。
效果上用默认的也可以。
接口如果做了批量：想要只请求一次接口，就得在beforeUpload里做处理，return false 就不会往后走。
但是会存在上传列表的状态问题，如果不显示上传列表就没关系，如果显示的话，就得最后把fileList 的状态修改为done, 否则一直uploading
progress 可能处理也比较麻烦。。

#### express multer 多文件上传指定动态路径问题参考： https://www.jianshu.com/p/f1489339d65a
注意：如果常规在 formData 中带参数，写在 file 的前面，比如 dest ,最先 formData.append('dest', xxx) , 在append文件。不然有可能拿不到。
或者可以多封装一层，传进去。文中最后一种方法。

#### node express 中图片文件名带中文，无法展示。
参考： https://blog.csdn.net/qq_39668938/article/details/107293250
app.js去掉 res.header("Content-Type", "application/json;charset=utf-8")
