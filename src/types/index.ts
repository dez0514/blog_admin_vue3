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