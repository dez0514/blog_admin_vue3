export interface ThemeOpt {
    primaryColor?: string;
    radius?: number;
    alertSuccessBg?: string
}
export interface ThemeSetOpt {
    primaryColor: string;
    targetValueReplacer?: object;
    gradientReplacer?: any
}
export interface themeItem {
    color: string;
    theme: string;
}
export interface themeStorage {
  themeColor: string;
  menuStyle: string;
  menuType: string;
}
export interface articleItem {
  id: number;
  title: string;
  extra_title: string;
  author: string;
  tags: string;
  banner: string;
  git: string;
  content: string;
  create_time: string;
  update_time: string;
  likes: number;
  views: number;
}
export interface tagItem {
  key: string;
  tagname: string;
  icon: string;
  color: string;
  gradientColor?: string;
}
export interface columnItem {
  title: string;
  dataIndex: string;
  key: string;
  align?: string,
  ellipsis?: boolean;
}

export interface styleItem {
  styleName: string;
  leftColor?: string;
  topColor?: string;
  bottomColor?: string;
}

export interface menuTypeItem {
  menuType: string;
  leftColor?: string;
  topColor?: string;
  bottomColor?: string;
}