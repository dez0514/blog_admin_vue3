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

export interface articleItem {
  key: string;
  name: string;
  age: number;
  address: string;
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
  align?: string
}