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
                  @click="handleChangeThemeColor(item.theme, index)"
                >
                  <check-outlined v-show="themeColorIndex === index" />
                </div>
              </template>
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
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons-vue";
import { changeTheme } from "../utils";
interface themeItem {
  color: string;
  theme: string;
}
const visibleDraw = ref<boolean>(false);
const themeColorList = ref<themeItem[]>([
  { color: "rgb(24, 144, 255)", theme: "default" },
  { color: "rgb(245, 34, 45)", theme: "dust" },
  { color: "rgb(250, 84, 28)", theme: "volcano" },
  { color: "rgb(250, 173, 20)", theme: "sunset" },
  { color: "rgb(19, 194, 194)", theme: "cyan" },
  { color: "rgb(82, 196, 26)", theme: "green" },
  { color: "rgb(47, 84, 235)", theme: "geekblue" },
  { color: "rgb(114, 46, 209)", theme: "purple" },
]);
const themeColorIndex = ref<string | number>(0);
const handleChangeShow = (show: boolean) => {
  visibleDraw.value = show;
};
const handleChangeThemeColor = (theme: string, index: string | number) => {
  themeColorIndex.value = index;
  changeTheme(theme);
};
onMounted(() => {
  const theme = localStorage.getItem("theme");
  let index = themeColorList.value.findIndex((fitem) => fitem.theme === theme);
  if (index > -1) {
    themeColorIndex.value = index;
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
  transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1); // 和抽屉保持一致
  z-index: 1001; // 至少比抽屉大1
  .icon {
    font-size: 28px;
    color: #fff;
    cursor: pointer;
  }
}
.theme-color {
  margin-top: 16px;
  overflow: hidden;
  .theme-color-block {
    float: left;
    width: 20px;
    height: 20px;
    margin-top: 8px;
    margin-right: 8px;
    color: #fff;
    font-weight: 700;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
  }
}
</style>
