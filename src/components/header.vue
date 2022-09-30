<template>
  <div class="header">
    <div class="header-left">
      <logo :visiable="themeOpts.menuType !== 'rowColumn'"/>
      <div v-if="themeOpts.menuType === 'column'" class="column-menu">
        <sidebar mode="horizontal" :sideTheme="(themeOpts.menuStyle === 'darkLight' || themeOpts.menuStyle === 'light') ? 'light':'dark'"></sidebar>
      </div>
    </div>
    <div>
      <a-dropdown @visibleChange="visibleChange">
        <div class="username">
          <a-avatar :src="avatar" />
          <span class="name">{{ userinfo?.username }}</span>
          <down-outlined v-show="!visible" class="icon down" />
          <up-outlined v-show="visible" class="icon up" />
        </div>
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="logout" style="text-align: center;">
              <logout-outlined style="margin-right: 10px;" />退出
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import logo from '@components/logo.vue'
import { ref, computed } from 'vue'
import { useRouter } from "vue-router";
import { LogoutOutlined, DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import { storeToRefs } from 'pinia'
import { themeStore } from '../store/themePinia'
import sidebar from '@components/sidebar.vue'
import avatar from '../assets/avatar_boy.png'
import { logout } from '../api/user'
const themeStores = themeStore()
const { themeColor, menuStyle, menuType } = storeToRefs(themeStores)
const themeOpts = computed(() => {
  return { themeColor: themeColor.value, menuStyle: menuStyle.value, menuType: menuType.value }
})
// defineProps({
//   collapsed: Boolean
// })
const router = useRouter();
interface UserInfo {
  username: string
}
const visible = ref<boolean>(false)
const userinfo = ref<UserInfo | undefined>()
const userStr = localStorage.getItem('userinfo')
if (userStr) {
  userinfo.value = JSON.parse(userStr)
}
const handleMenuClick = async(context: { item: any, key: string, keyPath: any }) => {
  console.log("click", context);
  if (context.key === 'logout') {
    const res:any = await logout()
    if(Number(res.code) === 0) {
      localStorage.clear()
      router.push('/login')
    }
  }
};
const visibleChange = (currentVisible: boolean) => {
  visible.value = currentVisible
}
</script>
<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  height: 64px;
  display: flex;
  align-items: center;
  color: var(--theme-header-color);
  border-bottom: 1px solid transparent;
  border-color: var(--theme-header-boder-color);
  .header-left {
    display: flex;
    flex: 1;
    .column-menu {
      flex: 1;
    }
  }

  .logo-wrap {
    width: 256px;
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
