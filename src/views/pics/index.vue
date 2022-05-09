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
      <!-- 弹出 新建文件夹 -->
    </div>
    <div class="pic-list">
      <!-- 图片列表 -->
      <!-- 上传图片 -->
      <div class="pic-item" v-for="(item, index) in bannerList" :key="index">
        <img :src="getImageUrl(item)" alt="">
        <div class="pic-link">{{item}}</div>
        <div class="copy-tip">
          <a-button type="primary" @click="copy(item)">复制地址</a-button>
          <a-button type="primary" style="margin-left: 5px" @click="preview(index)">预览</a-button>
          <a-popconfirm
            title="确定删除此图片？"
            cancelText="取消"
            okText="确定"
            @confirm="handleDelete(index)"
          >
            <a-button class="delete" type="primary"><delete-outlined /></a-button>
          </a-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, inject } from 'vue'
import previewImg from '../../components/previewImage'
import useClipboard from 'vue-clipboard3'
import { DeleteOutlined } from '@ant-design/icons-vue'
const { toClipboard } = useClipboard()
const message: any = inject('$message')
const folderTabIndex = ref<number>(0)
const getImageUrl = (name: string) => {
  return new URL(`../../assets/test/${name}`, import.meta.url).href
}
const bannerList = ['test1.jpg', 'test2.jpg', 'test3.jpg', 'test4.jpg']
const handleCheckFolder = (index: number) => {
  folderTabIndex.value = index
}
const copy = async (copytxt: string) => {
  try {
    await toClipboard(copytxt)
    message.success('复制成功！')
  } catch {
    message.success('复制失败，请重试')
  }
}
const preview = (index: number) => {
  const srcArr = bannerList.map(item => getImageUrl(item))
  previewImg(srcArr, index, bannerList)
}
const handleDelete = (index: number) => {
  console.log('删除图片，列表传id', index)
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
.pic-list {
  column-count: 4;
  column-gap: 10px;
  .pic-item {
    position: relative;
    padding: 10px;
    break-inside: avoid;
    box-sizing: border-box;
    border: 1px solid #eaeaea;
    margin-bottom: 10px;
    font-weight: bold;
    color: #000;
    img {
      display: block;
      width: 100%;
    }
    .pic-link {
      margin-top: 10px;
    }
    .copy-tip {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .5);
      .delete {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .pic-item:hover .copy-tip {
    display: block;
  }
}
</style>
