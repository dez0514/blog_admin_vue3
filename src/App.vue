<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { changeTheme, defaultTheme } from "./utils";
import { themeColorList } from "./utils/config";

onMounted(() => {
  let themeObjStr = localStorage.getItem("theme");
  // console.log("主题色值===", theme);
  let theme = defaultTheme.themeColor
  if (themeObjStr) {
    theme = JSON.parse(themeObjStr).themeColor
    let index = themeColorList.findIndex((fitem) => fitem.theme === theme)
    if (index > -1) {
      changeTheme(theme, { primaryColor: themeColorList[index].color });
    }
  } else {
    changeTheme(theme);
  }
});
</script>
