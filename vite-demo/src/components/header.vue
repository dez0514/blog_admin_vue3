<script setup lang="ts">
import { SettingOutlined, UserOutlined } from "@ant-design/icons-vue";
const handleButtonClick = (e: Event) => {
  console.log("click left button", e);
};
const handleMenuClick = (e: Event) => {
  console.log("click", e);
};
</script>
<template>
  <div class="header">
    <div><setting-outlined class="icon" />管理系统</div>
    <a-dropdown>
        <div class="username"><user-outlined class="icon" /> zwd</div>
        <template #overlay>
            <a-menu class="droplist" @click="handleMenuClick">
                <a-menu-item key="1" class="logout-txt">退出</a-menu-item>
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
