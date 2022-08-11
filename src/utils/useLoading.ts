import { ref } from 'vue'
const showLoading = ref<boolean>(false)
export const useLoading = () => {
  const setLoading = (loading: boolean) => {
    showLoading.value = loading
  }
  return {
    showLoading,
    setLoading
  }
}
// 使用：
// import { useLoading } from '../../utils/useLoading'
// const { showLoading, setLoading } = useLoading(false)
// const handleLoading = () => {
//   setLoading(!showLoading.value)
// }