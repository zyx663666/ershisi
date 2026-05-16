/**
 * Tailwind CSS 配置文件
 * 详情参考：https://tailwindcss.com/docs/configuration
 */
export default {
  // 指定哪些文件需要被 Tailwind 处理
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  // 扩展主题配置（可自定义颜色、字体等）
  theme: {
    extend: {},
  },
  // 插件配置
  plugins: [],
}
