import { themeItem, styleItem, menuTypeItem } from '../types'
export const themeColorList: themeItem[] = [
  { color: "rgb(24, 144, 255)", theme: "default" },
  { color: "rgb(245, 34, 45)", theme: "dust" },
  { color: "rgb(250, 84, 28)", theme: "volcano" },
  { color: "rgb(250, 173, 20)", theme: "sunset" },
  { color: "rgb(19, 194, 194)", theme: "cyan" },
  { color: "rgb(82, 196, 26)", theme: "green" },
  { color: "rgb(47, 84, 235)", theme: "geekblue" },
  { color: "rgb(114, 46, 209)", theme: "purple" }
];
export const styleList: styleItem[] = [
  {
    styleName: 'light',
    leftColor: 'light',
    topColor: 'light',
    bottomColor: 'light'
  },
  {
    styleName: 'dark',
    leftColor: 'dark',
    topColor: 'light',
    bottomColor: 'light'
  },
  {
    styleName: 'deepDark',
    leftColor: 'dark',
    topColor: 'dark',
    bottomColor: 'dark'
  }
]
export const menuTypeList: menuTypeItem[] = [
  {
    menuType: 'columnRow',
    leftColor: 'light',
    topColor: 'light',
    bottomColor: 'light'
  },
  {
    menuType: 'rowColumn',
    leftColor: 'light',
    topColor: 'light',
    bottomColor: 'light'
  },
  {
    menuType: 'column',
    leftColor: 'light',
    topColor: 'light',
    bottomColor: 'light'
  }
]