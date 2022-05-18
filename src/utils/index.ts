import Color from "color";
import setCustomTheme from "@setCustomTheme";
import { ThemeOpt, ThemeSetOpt, themeStorage } from '../types'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue'
import { themeStore } from '../store/themePinia'

const darkSideAndHeadColor = '#fff'
const darkSideAndHeadBorder = '#727e89'
const darkSideRightColor = '#001529'
const lightSideAndHeadColor = '#000'
const lightSideAndHeadBorder = '#f0f0f0'


export const defaultTheme: themeStorage = {
  themeColor: 'default',
  menuType: 'columnRow',
  menuStyle: 'light'
}
// sidebar 和 header 获取对应的色值
export const getSideAndHeaderThemeMap = (isSideLight: boolean, isHeaderLight: boolean) => {
  return {
    'theme-side-color': isSideLight ? lightSideAndHeadColor : darkSideAndHeadColor,
    'theme-side-boder-color': isSideLight ? lightSideAndHeadBorder : darkSideAndHeadBorder,
    'theme-header-color': isHeaderLight ? lightSideAndHeadColor : darkSideAndHeadColor,
    'theme-header-boder-color': isHeaderLight ? lightSideAndHeadBorder : darkSideAndHeadBorder,
    'theme-side-rightborder': isSideLight ? lightSideAndHeadBorder : darkSideRightColor
  }
}
// sidebar 和 header 设置色值, 先各自判断自己是否是 light (根据menuStyle值的特点)
// menuStyle 共四个值，例如：'lightDark' 指 sidebar是light，header是dark。 'light' 指都是 light。其他两个类似。
export const setSideAndHeaderTheme = (isSideLight: boolean, isHeaderLight: boolean) => {
  const themeMap = getSideAndHeaderThemeMap(isSideLight, isHeaderLight)
  const body = document.body
  Object.keys(themeMap).forEach(key => {
    body.style.setProperty(`--${key}`, (themeMap as any)[key])
  })
}
// 修改主题色
export const changeTheme = (theme: string, themeOptions?: ThemeOpt) => {
  let themeObj: themeStorage = { ...defaultTheme, themeColor: theme }
  const objsStr = localStorage.getItem('theme')
  if(objsStr) {
    const objs = JSON.parse(objsStr)
    if(objs.menuType) themeObj.menuType = objs.menuType
    if(objs.menuStyle) themeObj.menuStyle = objs.menuStyle
  }
  window.document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', JSON.stringify(themeObj))
  const themeStores = themeStore()
  themeStores.updateThemeConfig(themeObj)
  // 设置header 和 sidebar 的颜色
  const isSideLight: boolean = (themeObj.menuStyle === 'lightDark' || themeObj.menuStyle === 'light')
  const isHeaderLight: boolean = (themeObj.menuStyle === 'darkLight' || themeObj.menuStyle === 'light')
  setSideAndHeaderTheme(isSideLight, isHeaderLight)
  //下面是 设置 ui 组件antd的颜色
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
// 修改菜单颜色风格
export const changeMenuStyle = (styleName: string) => {
  let themeObj: themeStorage = { ...defaultTheme, menuStyle: styleName }
  const objsStr = localStorage.getItem('theme')
  if(objsStr) {
    const objs = JSON.parse(objsStr)
    if(objs.themeColor) themeObj.themeColor = objs.themeColor
    if(objs.menuType) themeObj.menuType = objs.menuType
  }
  localStorage.setItem('theme', JSON.stringify(themeObj))
  const themeStores = themeStore()
  themeStores.updateThemeConfig(themeObj)
  // 设置header 和 sidebar 的颜色
  const isSideLight: boolean = (themeObj.menuStyle === 'lightDark' || themeObj.menuStyle === 'light')
  const isHeaderLight: boolean = (themeObj.menuStyle === 'darkLight' || themeObj.menuStyle === 'light')
  setSideAndHeaderTheme(isSideLight, isHeaderLight)
}
// 修改菜单导航布局模式
export const changeMenuType = (typeName: string) => {
  console.log('typeName==', typeName)
  let themeObj: themeStorage = { ...defaultTheme, menuType: typeName }
  const objsStr = localStorage.getItem('theme')
  if(objsStr) {
    const objs = JSON.parse(objsStr)
    if(objs.themeColor) themeObj.themeColor = objs.themeColor
    if(objs.menuStyle) themeObj.menuStyle = objs.menuStyle
  }
  localStorage.setItem('theme', JSON.stringify(themeObj))
  const themeStores = themeStore()
  themeStores.updateThemeConfig(themeObj)
  // 设置header 和 sidebar 的颜色
  const isSideLight: boolean = (themeObj.menuStyle === 'lightDark' || themeObj.menuStyle === 'light')
  const isHeaderLight: boolean = (themeObj.menuStyle === 'darkLight' || themeObj.menuStyle === 'light')
  setSideAndHeaderTheme(isSideLight, isHeaderLight)
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