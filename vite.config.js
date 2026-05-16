/**
 * Vite 构建工具配置文件
 * 详情参考：https://vitejs.dev/config/
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 部署配置：仓库名作为基础路径
  base: '/ershisi/',
})
