import { todoStore } from '../store/pinia'
import { storeToRefs } from 'pinia'
const store = todoStore()
const refStore = storeToRefs(store)
export const getData = () => {
  console.log(refStore)
}