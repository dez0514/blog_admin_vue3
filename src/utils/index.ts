import Color from "color";
import setCustomTheme from "@setCustomTheme";
import { ThemeOpt } from '../types'
interface ThemeSetOpt {
    primaryColor: string;
    targetValueReplacer?: object;
    gradientReplacer?: any
}
export const changeTheme = (theme:string, themeOptions?:ThemeOpt) => {
    window.document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    const alertSuccessBgReplacerKey = '#F7D06B'
    let themeSetOption:ThemeSetOpt = {
        primaryColor: (themeOptions && themeOptions.primaryColor) || "#1890ff",
        gradientReplacer: {
            [alertSuccessBgReplacerKey]: (themeOptions && themeOptions.alertSuccessBg) || '#f6ffed'
        }
    }
    let targetValueReplacer:object = {
        "6px 6px 0 0": "6px 6px 0 0",
        "6px": "6px",
        "0 0 6px 6px": "0 0 6px 6px",
        "6px 0 0 0": "6px 0 0 0",
        "0 6px 0 0": "0 6px 0 0",
        "6px 0 0 6px": "6px 0 0 6px",
        "0 6px 6px 0": "0 6px 6px 0",
    };
    if(themeOptions && themeOptions.radius) {
        targetValueReplacer = Object.keys(targetValueReplacer).reduce((tol, key) => {
            return { ...tol, [key]: key.replace(/6px/g, `${themeOptions.radius}px`) };
        },{});
        themeSetOption.targetValueReplacer = targetValueReplacer
    }
    console.log('themeSetOption===',themeSetOption)
    setCustomTheme({
        Color,
        ...themeSetOption
    });
}