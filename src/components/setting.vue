<template>
  <div class="setting">
    <div
      class="set-btn"
      :style="{
        transform: visibleDraw ? 'translateX(-400px)' : 'translateX(0)',
      }"
      @click="handleChangeShow(!visibleDraw)"
    >
      <setting-outlined class="icon" v-show="!visibleDraw" />
      <close-outlined class="icon" v-show="visibleDraw" />
    </div>
    <a-drawer
      :width="400"
      title=""
      placement="right"
      :visible="visibleDraw"
      :closable="false"
    >
      <div>
        <div style="margin-bottom: 24px">
          <h3 class="ant-pro-setting-drawer-title">主题色</h3>
          <div class="theme-color">
            <div class="theme-color-content">
              <template v-for="(item, index) in themeColorList" :key="index">
                <div
                  class="theme-color-block"
                  :style="{ backgroundColor: item.color }"
                  @click="handleChangeThemeColor(item, index)"
                >
                  <span v-show="themeColorIndex === index">✔</span>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 24px">
          <h3 class="ant-pro-setting-drawer-title">背景风格</h3>
          <div class="box-style-wrap">
            <div class="style-box" v-for="(item, index) in styleArr" :key="index" @click="handleChangeStyle(index)">
              <div :class="['box-left', item.leftColor]"></div>
              <div class="box-right">
                <div :class="['box-top', item.topColor]"></div>
                <div :class="['box-bot', item.bottomColor]"></div>
              </div>
              <span class="check_icon" v-show="menuStyleIndex === index">✔</span>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 24px">
          <h3 class="ant-pro-setting-drawer-title">导航模式</h3>
          <div class="box-style-wrap">
            <div class="style-box" v-for="(item, index) in menuTypeArr" :key="index" @click="handleMenuType(index)">
              <div v-if="index === 1" :class="['box-left', 'border-r', item.leftColor]"></div>
              <div class="box-right">
                <div :class="['box-top', 'border-b', item.topColor]"></div>
                <div :class="['box-bot', item.bottomColor]">
                  <div v-if="index === 0" :class="['box-bot-left', 'border-r', item.leftColor]"></div>
                </div>
              </div>
              <span class="check_icon" v-show="menuTypeIndex === index">✔</span>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  SettingOutlined,
  CloseOutlined
} from "@ant-design/icons-vue";
import { changeTheme, changeMenuStyle, changeMenuType } from "../utils";
import { themeColorList, styleList, menuTypeList } from '../utils/config'
import { themeItem, styleItem ,menuTypeItem } from '../types'

const visibleDraw = ref<boolean>(false);
const themeColorArr = ref<themeItem[]>([...themeColorList]);
const themeColorIndex = ref<string | number>(0);
const styleArr = ref<styleItem[]>([...styleList])
const menuStyleIndex = ref<string | number>(0);
const menuTypeArr = ref<menuTypeItem[]>([...menuTypeList])
const menuTypeIndex = ref<string | number>(0);
const handleChangeShow = (show: boolean) => {
  visibleDraw.value = show;
};
const handleChangeThemeColor = ({color,theme}:{color:string, theme:string}, index: string | number) => {
  themeColorIndex.value = index;
  changeTheme(theme, { primaryColor: color });
};
const handleChangeStyle = (index: number | string) => {
  menuStyleIndex.value = index
  console.log('(styleArr as any)[index].menuStyle====',(styleArr.value as any)[index])
  changeMenuStyle((styleArr.value as any)[index].styleName)
}
const handleMenuType = (index: number | string) => {
  menuTypeIndex.value = index
  changeMenuType((menuTypeArr.value as any)[index].menuType)
}
onMounted(() => {
  const themeObjStr = localStorage.getItem("theme")
  if(themeObjStr) {
    const themeObjs = JSON.parse(themeObjStr)
    const colorIndex = themeColorArr.value.findIndex((fitem) => fitem.theme === themeObjs.themeColor);
    if (colorIndex > -1) {
      themeColorIndex.value = colorIndex;
    }
    const styleIndex = styleArr.value.findIndex((fitem) => fitem.styleName === themeObjs.menuStyle);
    if (colorIndex > -1) {
      menuStyleIndex.value = styleIndex;
    }
    const typeIndex = menuTypeArr.value.findIndex((fitem) => fitem.menuType === themeObjs.menuType);
    if (colorIndex > -1) {
      menuTypeIndex.value = typeIndex;
    }
  }
});
</script>
<style lang="scss" scoped>
.set-btn {
  position: fixed;
  top: 50%;
  right: 1px;
  margin-top: -24px;
  height: 48px;
  width: 48px;
  line-height: 58px;
  text-align: center;
  border-radius: 4px 0 0 4px;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1); // 和抽屉保持一致
  z-index: 1001; // 至少比抽屉大1
  .icon {
    font-size: 28px;
    color: #fff;
    cursor: pointer;
  }
}
.ant-pro-setting-drawer-title {
  font-weight: 700;
  font-size: 16px;
}
.theme-color {
  margin-top: 16px;
  .theme-color-content {
    display: flex;
    flex-wrap: wrap;
  }
  .theme-color-block {
    width: 34px;
    height: 22px;
    margin-top: 8px;
    margin-right: 8px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
  }
}
.box-style-wrap {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  .style-box {
    position: relative;
    overflow: hidden;
    display: flex;
    background: pink;
    width: 50px;
    height: 50px;
    margin-top: 8px;
    margin-right: 20px;
    text-align: center;
    border-radius: 5px;
    box-shadow: 0px 1px 4px #d3d3d3;
    border: 1px solid #d3d3d3;
    cursor: pointer;
    .box-left {
      width: 20px;
      background: #fff;
      &.dark {
        background: #0a1f30;
      }
    }
    .box-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      .box-top {
        height: 12px;
        background: #fff;
        &.dark {
          background: #0a1f30;
        }
      }
      .box-bot {
        flex: 1;
        background: #f0f2f5;
        display: flex;
        &.dark {
          background: #1e3342;
        }
        .box-bot-left {
          width: 20px;
          background: #fff;
          &.dark {
            background: #1e3342;
          }
        }
      }
    }
    .check_icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.border-r {
  border-right: 1px solid #d3d3d3;
}
.border-b {
  border-bottom: 1px solid #d3d3d3;
}
</style>
