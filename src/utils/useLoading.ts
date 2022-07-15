import { ref } from 'vue'
// const isLoading = ref<boolean>(false)
// 放在外面定义相当于全局变量，效果可以代替store
export const useLoading = (init: boolean) => {
  // 放里面就是组件级别的，和组件内定义差不多，与其他组件无关，其他组件拿到的是新的
  const isLoading = ref<boolean>(init)
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }
  return {
    isLoading,
    setLoading
  }
}
// 使用：
// import { useLoading } from '../../utils/useLoading'
// const { isLoading, setLoading } = useLoading(false)
// const handleLoading = () => {
//   console.log('isLoading==', isLoading)
//   setLoading(!isLoading.value)
// }