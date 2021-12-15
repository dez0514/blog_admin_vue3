import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import styleImport from 'vite-plugin-style-import'
import { resolve } from 'path';
import Components  from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import {
  themePreprocessorPlugin,
  themePreprocessorHmrPlugin,
} from "@zougt/vite-plugin-theme-preprocessor";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {  
      // 别名配置
      '@': resolve('src/'),
      '@components': resolve('src/components'),
    },
  },
  server: {
    // host: '10.0.13.63',
    // port: 8086,
    // open: true,
    watch: {
      // themePreprocessorHmrPlugin 热更新时必需的，希望监听setCustomTheme.js
      ignored: ["!**/node_modules/**/setCustomTheme.js"],
    }
  },
  css:{
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variable.scss";`//引用公共样式，使用vite搭建项目只安装sass即可，不需要安装node-sass,sass-loader
      },
      less: {
        javascriptEnabled: true,
      },
    }
  },
  plugins: [
    vue(),
    Components({
			resolvers: [
        AntDesignVueResolver({ importStyle: "less" }),
      ]
		}),
    // 创建动态主题切换
    themePreprocessorPlugin({
      less: {
        // 启用任意主题色模式
        arbitraryMode: true,
        defaultPrimaryColor: "#512da7",
        multipleScopeVars: [
          {
            // 必需
            scopeName: "theme-default",
            path: resolve("src/theme/theme-vars.less"),
          },
        ],
        // css中不是由主题色变量生成的颜色，也让它抽取到主题css内，可以提高权重
        includeStyleWithColors: [
          {
            color: "#ffffff",
            // 此类颜色的是否跟随主题色梯度变化，默认false
            // inGradient: true,
          },
        ],
      },
    }),
    // 主题热更新，不得已分开插件，因为需要vite插件顺序enforce
    themePreprocessorHmrPlugin(),
    // styleImport({ // 换主题的话不能使用这个按需引入样式了
    //   libs: [{
    //    libraryName: "ant-design-vue",
    //    esModule: true,
    //    resolveStyle: (name) => {
    //     return `ant-design-vue/es/${name}/style/css`;
    //    },
    //   }]
    // })
  ]
})
