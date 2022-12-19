// https://mp.weixin.qq.com/s?__biz=MzA4MjA1MDM3Ng==&mid=2450827694&idx=1&sn=8fafbbdb2f9ce604ca1862bc331616fb&chksm=886ba589bf1c2c9f6d92978a0649d1051d10a7fc2df1c79399990aae590620643e80818f8760&scene=126&sessionid=1671074023#rd
import { reactive, ref } from 'vue'
// 一个用于重置对象字段为原始值的函数
// import { resetObjToPrimitiveType } from '@/utils/tool'
const resetObjToPrimitiveType = (obj: any) => {
  Object.keys(obj).forEach(item => {
    obj[item] = null
  })
}
/**
 * @description usePage 接收一个 opts 参数，返回列表所需数据
 * @param {Object} opts.searchForm - 默认查询参数
 * @param {Function} opts.getListApi  - 获取列表数据的接口
 * @param {Function} opts.customQueryParameters  - 自定义查询参数
 * @param {Function} opts.getListFunc  - 执行完 getList 成功后执行的逻辑 有一个opts参数
 * @param {Function} opts.resetFunc  - 执行完 reset 后执行的逻辑
 * @param {Function} opts.sizeChangeFunc  - 执行完 sizeChange 后执行的逻辑
 * @param {Function} opts.currentChangeFunc  - 执行完 currentChange 后执行的逻辑
 */
export const usePage = (opts: any) => {
  // searchForm 由外部传入，内部传入导出的数据无法推导类型即无法知道对象里有什么也会失去代码提示
  const {
    searchForm = {},
    getListApi,
    customQueryParameters = () => {},
    getListFunc = (opts: any) => {},
    resetFunc = () => {},
    sizeChangeFunc = () => {},
    currentChangeFunc = () => {}
  } = opts

  const reset = () => {
    Object.assign(searchForm, resetObjToPrimitiveType(searchForm))
    resetFunc()
    handleCurrentChange(1)
  }

  const page = reactive({
    pageSize: 10,
    pageNo: 1,
    total: 0
  })

  const tableData = ref([])
  const getList = () => {
    const opts = {
      ...page,
      ...searchForm,
      ...customQueryParameters()
    }

    getListApi(opts).then((res: any) => {
      if (res.code === 0) {
        tableData.value = res.data?.rows || []
        page.total = res.data?.total || 0

        getListFunc(opts)
      }
    })
  }

  const handleSizeChange = (size: number) => {
    page.pageSize = size
    sizeChangeFunc()
    getList()
  }

  const handleCurrentChange = (cur: number) => {
    page.pageNo = cur
    currentChangeFunc()
    getList()
  }

  return {
    searchForm,
    reset,
    page,
    tableData,
    handleSizeChange,
    handleCurrentChange
  }
}

// 使用
// import { usePage } from 'xxx/usePage'
// import { getList } from 'xxx/api'
// // 查询参数
// const searchForm = reactive({
//   createEndTime: '',
//   createStartTime: ''
// })
// // 接收 查询参数、获取列表的接口 返回 列表所需要的数据、分页参数、分页函数等
// const { reset, page, tableData, handleSizeChange, handleCurrentChange } = usePage({
//   searchForm,
//   getListApi: getList
// })
// // 首次获取数据使用 reset方式即可 tableData 的数据自动更新
// reset()