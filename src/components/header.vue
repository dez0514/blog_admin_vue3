<script setup lang="ts">
import { useRouter, useRoute, RouteRecordRaw } from "vue-router";
import { SettingOutlined, UserOutlined } from "@ant-design/icons-vue";
const router = useRouter();
const handleButtonClick = (e: Event) => {
  console.log("click left button", e);
};
const handleMenuClick = (context: { item:any, key: any, keyPath:any }) => {
  console.log("click", context);
  if(context.key === 'logout') {
    router.push('/login');
  }
};
</script>
<template>
  <div class="header">
    <div><setting-outlined class="icon" />博客管理系统</div>
    <a-dropdown>
        <div class="username"><user-outlined class="icon" />zhangwangde</div>
        <template #overlay>
            <a-menu class="droplist" @click="handleMenuClick">
                <a-menu-item key="logout" class="logout-txt">退出</a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
  </div>
</template>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .icon {
    margin-right: 10px;
  }
  .username {
      cursor: pointer;
  }
}
.droplist {
    text-align: center;
}
</style>
