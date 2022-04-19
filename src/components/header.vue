<template>
  <div class="header">
    <div class="logo-wrap" :style="{ width: collapsed ? '60px' : '256px' }">
      <read-outlined class="logo-icon" />
      <span v-show="!collapsed">博客管理系统</span>
    </div>
    <a-dropdown @visibleChange="visibleChange">
        <div class="username">
          <a-avatar :src="avatar" />
          <span class="name">{{userinfo?.username}}</span>
          <down-outlined v-show="!visible" class="icon down"/>
          <up-outlined v-show="visible" class="icon up"/>
        </div>
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
import { ReadOutlined, LogoutOutlined, DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import avatar from '../assets/avatar_boy.png'
defineProps({
  collapsed: Boolean
})
const router = useRouter();
interface UserInfo {
  username: string
}
const visible = ref<boolean>(false)
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
const visibleChange = (currentVisible: boolean) => {
  visible.value = currentVisible
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .logo-wrap {
    box-sizing: border-box;
    padding: 0 18px;
    text-align: left;
  }
  .logo-icon {
    margin-right: 10px;
    position: relative;
    top: 3px;
    font-size: 22px;
  }
  .username {
    padding: 0 18px;
    cursor: pointer;
    .icon {
      position: relative;
      font-size: 14px;
      &.down {
        top: 2px;
      }
      &.up {
        top: -1px;
      }
    }
    .name {
      display: inline-block;
      padding: 0 10px;
    }
  }
}
</style>
