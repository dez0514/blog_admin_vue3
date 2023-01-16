<template>
  <img ref="pic" />
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted } from 'vue';
interface IMark {
  url: string;
  content: string;
  cb: Function | null;
  onError: Function | null;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  font?: string;
  fillStyle?: string;
  textX?: number;
  textY?: number;
}
interface Props {
  src: string;
  alt: string;
}
const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: ''
})
const emit = defineEmits<{ (e: 'error'): void }>()
const { src } = toRefs(props)
const pic = ref<HTMLImageElement | null>(null)
const errorCb = () => {
  emit('error')
}
const createWaterMarkImg = ({
  url = '',
  content = '',
  cb = null,
  onError = null,
  textAlign = 'center',
  textBaseline = 'middle',
  font = "20px Microsoft Yahei",
  fillStyle = 'rgba(184, 184, 184, 0.8)',
  textX = 100,
  textY = 30
}:IMark) => {
  const img = new Image();
  img.src = url;
  img.crossOrigin = 'anonymous'
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if(ctx) {
      ctx.drawImage(img, 0, 0);
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;
      ctx.font = font;
      ctx.fillStyle = fillStyle;
      ctx.fillText(content, img.width - textX, img.height - textY);
      const base64Url = canvas.toDataURL();
      cb && cb(base64Url);
    }
  }
  img.onerror = function () {
    onError && onError()
  }
}
onMounted(() => {
  createWaterMarkImg({
    url: src.value,
    content: 'zwd的个人小站',
    cb: (base64Url: string) => {
      pic.value && (pic.value.src = base64Url)
    },
    onError: errorCb
  })
})
</script>