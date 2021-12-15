<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { changeTheme } from "./utils";
interface themeItem {
  color: string;
  theme: string;
}
onMounted(() => {
  const themeColorList: themeItem[] = [
    { color: "rgb(24, 144, 255)", theme: "default" },
    { color: "rgb(245, 34, 45)", theme: "dust" },
    { color: "rgb(250, 84, 28)", theme: "volcano" },
    { color: "rgb(250, 173, 20)", theme: "sunset" },
    { color: "rgb(19, 194, 194)", theme: "cyan" },
    { color: "rgb(82, 196, 26)", theme: "green" },
    { color: "rgb(47, 84, 235)", theme: "geekblue" },
    { color: "rgb(114, 46, 209)", theme: "purple" },
  ];
  let theme = localStorage.getItem("theme");
  console.log("主题色值===", theme);
  if (!theme) {
    theme = "default";
    changeTheme(theme);
  } else {
    let index = themeColorList.findIndex((fitem) => fitem.theme === theme);
    if (index > -1) {
      changeTheme(theme, { primaryColor: themeColorList[index].color });
    }
  }
});
</script>
