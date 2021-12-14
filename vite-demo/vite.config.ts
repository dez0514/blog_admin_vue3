import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'
import { resolve } from 'path';
import Components  from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
			resolvers: [
        AntDesignVueResolver(),
      ]
		}),
    styleImport({
      libs: [{
       libraryName: "ant-design-vue",
       esModule: true,
       resolveStyle: (name) => {
        return `ant-design-vue/es/${name}/style/css`;
       },
      }]
    })
  ],
  base: './',
  resolve: {
    alias: {  
      // 别名配置
      '@': resolve('src/'),
      '@components': resolve('src/components'),
    },
  },
  // server: {
  //   host: '10.0.13.63',
  //   port: 8086,
  //   open: true,
  // },
  css:{
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variable.scss";`//引用公共样式，使用vite搭建项目只安装sass即可，不需要安装node-sass,sass-loader
      }
    }
  }
})
