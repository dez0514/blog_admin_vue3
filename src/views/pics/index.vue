<template>
  <div class="pics-wrap">
    <div class="folder_list">
      <div class="folder_wrap" @click="handleCheckFolder(1)" >
        <div :class="[folderTabIndex === 1 ? 'open_folder' : 'folder']"></div>
        <div class="folder-name">folder_one</div>
      </div>
      <div class="folder_wrap" @click="handleCheckFolder(2)" >
        <div :class="[folderTabIndex === 2 ? 'open_folder' : 'folder']"></div>
        <div class="folder-name">folder_two</div>
      </div>
      <!-- 新建文件夹 -->
    </div>
    <div class="masonry">
      <!-- 图片列表 -->
      <!-- 上传图片 -->
      <div class="item" style="height: 50px;">1</div>
      <div class="item" style="height: 100px;">2</div>
      <div class="item" style="height: 150px;">3</div>
      <div class="item" style="height: 130px;">4</div>
      <div class="item" style="height: 210px;">5</div>
      <div class="item" style="height: 170px;">6</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, inject, toRaw } from 'vue'
const folderTabIndex = ref<number>(0)
const handleCheckFolder = (index: number) => {
  folderTabIndex.value = index
}
</script>

<style lang="scss" scoped>
.pics-wrap {
  height: calc(100% - 20px);
  overflow-y: auto;
  padding: 0 20px;
}
.folder_list {
  display: flex;
  flex-direction: row;
}
.folder_wrap {
  width: 100px;
}
.folder-name {
  width: 100px;
  text-align: center;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.folder {
  width: 100px;
  height: 100px;
  background: url(../../assets/folder.png) no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;
}
.open_folder {
  width: 100px;
  height: 100px;
  background: url(../../assets/open_folder.png) no-repeat;
  background-position: 8px 16px;
  background-size: 84% 68%;
}
.masonry {
  column-count: 3;
  column-gap: 5px;
  .item {
    break-inside: avoid;
    box-sizing: border-box;
    border: 1px solid brown;
    margin-bottom: 7px;
    background-color: wheat;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    font-weight: bold;
    color: brown;
  }
}
</style>
