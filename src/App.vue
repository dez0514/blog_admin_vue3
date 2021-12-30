<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { changeTheme } from "./utils";
import { themeColorList } from "./utils/config";

onMounted(() => {
  let theme = localStorage.getItem("theme");
  // console.log("主题色值===", theme);
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
