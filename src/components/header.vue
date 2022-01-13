<template>
  <div class="header">
    <div><setting-outlined class="icon" />博客管理系统</div>
    <a-dropdown>
        <div class="username"><user-outlined class="icon" />{{userinfo?.username}}</div>
        <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="logout" style="text-align: center;">
                <logout-outlined style="margin-right: 10px;"/>退出
              </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router";
import { SettingOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons-vue";
const router = useRouter();
interface UserInfo {
  username: string
}
const userinfo = ref<UserInfo | undefined>()
const userStr = localStorage.getItem('userinfo')
if(userStr) {
  userinfo.value = JSON.parse(userStr)
}
const handleMenuClick = (context: { item: any, key: string, keyPath: any }) => {
  console.log("click", context);
  if(context.key === 'logout') {
    localStorage.clear()
    router.push('/login');
  }
};
</script>
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
</style>
