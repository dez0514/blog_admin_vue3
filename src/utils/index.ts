import Color from "color";
import setCustomTheme from "@setCustomTheme";
import { ThemeOpt, ThemeSetOpt } from '../types'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue'

export const changeTheme = (theme: string, themeOptions?: ThemeOpt) => {
  window.document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  const alertSuccessBgReplacerKey = '#F7D06B'
  let themeSetOption: ThemeSetOpt = {
    primaryColor: (themeOptions && themeOptions.primaryColor) || "#1890ff",
    gradientReplacer: {
      [alertSuccessBgReplacerKey]: (themeOptions && themeOptions.alertSuccessBg) || '#f6ffed'
    }
  }
  let targetValueReplacer: object = {
    "6px 6px 0 0": "6px 6px 0 0",
    "6px": "6px",
    "0 0 6px 6px": "0 0 6px 6px",
    "6px 0 0 0": "6px 0 0 0",
    "0 6px 0 0": "0 6px 0 0",
    "6px 0 0 6px": "6px 0 0 6px",
    "0 6px 6px 0": "0 6px 6px 0",
  };
  if (themeOptions && themeOptions.radius) {
    targetValueReplacer = Object.keys(targetValueReplacer).reduce((tol, key) => {
      return { ...tol, [key]: key.replace(/6px/g, `${themeOptions.radius}px`) };
    }, {});
    themeSetOption.targetValueReplacer = targetValueReplacer
  }
  // console.log('themeSetOption===',themeSetOption)
  setCustomTheme({
    Color,
    ...themeSetOption
  });
}
/**
  * @param {成功回调} callBack
  * @param {标题} title
  * @param {内容} content
 */
export const promit = (callBack: Function, title: string = '提示', content: string = '确认此操作？') => {
  Modal.confirm({
    title: title,
    icon: createVNode(ExclamationCircleOutlined),
    content: content,
    okText: '确认',
    cancelText: '取消',
    maskClosable: false,
    onOk: () => {
      callBack()
    }
  })
}