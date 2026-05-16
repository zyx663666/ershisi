# 二十四节气 - Vue3 单页面应用

一个展示中国二十四节气的交互式单页面应用，采用现代中国风格设计。

## 功能特性

### 核心功能
- **底部半圆轮盘**：展示24个节气，均匀分布在半圆弧线上
- **逆时针旋转切换**：点击任意节气或使用自动播放，轮盘平滑逆时针旋转
- **季节动态背景**：根据当前节气所属季节切换渐变背景
  - 春：嫩绿渐变
  - 夏：深绿渐变
  - 秋：金黄渐变
  - 冬：冰雪蓝渐变
- **四季粒子效果**：春为花瓣飘落，夏为萤火虫，秋为落叶，冬为雪花
- **节气描述显示**：轮盘上方展示当前节气简短描述，带淡入动画
- **自动播放**：右下角按钮，每5秒自动切换下一个节气

### 设计风格
- 现代中国风配色
- 思源宋体（Noto Serif SC）字体
- GSAP 动画引擎实现流畅过渡
- 响应式设计，适配各种屏幕

## 项目结构

```
g:\Trae\二十四节气
├── src/
│   ├── assets/
│   │   └── main.css          # 全局样式（Tailwind CSS）
│   ├── components/
│   │   └── WheelView.vue     # 核心轮盘组件
│   ├── data/
│   │   └── terms.js          # 24节气数据
│   ├── App.vue               # 根组件
│   └── main.js               # 应用入口
├── index.html                 # HTML 入口
├── package.json              # 项目配置
├── vite.config.js            # Vite 配置
├── tailwind.config.js        # Tailwind CSS 配置
└── postcss.config.js         # PostCSS 配置
```

## 技术栈

| 技术 | 说明 | 版本 |
|------|------|------|
| Vue 3 | 渐进式 JavaScript 框架 | ^3.5.0 |
| Vite | 下一代前端构建工具 | ^5.4.0 |
| Tailwind CSS | 实用优先的 CSS 框架 | ^3.4.0 |
| GSAP | 专业级动画引擎 | ^3.12.0 |

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173/

### 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录

## 组件说明

### WheelView.vue

核心组件，实现以下功能：

#### 状态管理
- `currentIndex`：当前选中的节气索引（0-23）
- `rotationAngle`：轮盘当前旋转角度
- `isAutoPlaying`：自动播放状态

#### 核心算法

**节气位置计算**
```javascript
// 每个节气间隔 15 度（360 / 24）
const offsetAngle = index * 15 - rotationAngle.value
const radian = (offsetAngle * Math.PI) / 180
const radius = 35  // 半径（相对于视口百分比）

// 圆心在 (50%, 100%)，即页面底部中央
const x = 50 + radius * Math.sin(radian)
const y = 100 - radius * Math.cos(radian)
```

**旋转动画**
```javascript
// GSAP 旋转动画
gsap.to(wheelRef.value, {
  rotation: targetAngle,
  duration: 1.2,
  ease: "power2.inOut"
})
```

#### 粒子系统

使用原生 Canvas API 实现四季粒子效果：

```javascript
class Particle {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    this.size = Math.random() * 4 + 2
    this.speedX = (Math.random() - 0.5) * 2
    this.speedY = Math.random() * 3 + 1
    // ...
  }

  update() {
    // 更新位置
    // 左右边界循环
    // 超出底部重置到顶部
  }

  draw(ctx) {
    // 绘制粒子
  }
}
```

## 数据结构

```javascript
{
  name: "立春",        // 中文名称
  pinyin: "Lìchūn",    // 拼音
  date: "2月3-5日",     // 大致日期范围
  season: "春",         // 所属季节（春/夏/秋/冬）
  description: "春季开始，万物复苏"  // 节气描述
}
```

## 季节配置

```javascript
// 背景渐变
const backgrounds = {
  '春': 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
  '夏': 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
  '秋': 'linear-gradient(135deg, #ff8f00 0%, #ffa000 50%, #ffb300 100%)',
  '冬': 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)'
}

// 粒子颜色
const particleColors = {
  '春': ['#ffb7c5', '#ff8fa3', '#ffc0cb', '#ff91a4'],  // 粉色花瓣
  '夏': ['#ffeb3b', '#fff176', '#fff59d', '#ffee58'],  // 黄色萤火虫
  '秋': ['#ff5722', '#ff9800', '#ffb74d', '#ffcc80'],  // 橙色落叶
  '冬': ['#ffffff', '#e1f5fe', '#b3e5fc', '#e0f7fa']   // 白色雪花
}
```

## 部署到 GitHub Pages

### 1. 配置仓库名称

编辑 [vite.config.js](vite.config.js)，将 `your-repo-name` 替换为你的 GitHub 仓库名称：

```javascript
export default defineConfig({
  plugins: [vue()],
  base: '/your-repo-name/',  // 替换为你的仓库名
})
```

### 2. 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如未初始化）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/用户名/仓库名.git

# 推送到 main 分支
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 打开 GitHub 仓库页面
2. 点击 **Settings** → **Pages**
3. **Source** 选择 **GitHub Actions**
4. 工作流会自动运行，部署完成后可通过 `https://用户名.github.io/仓库名/` 访问

### 4. 自动部署

每次推送到 `main` 分支时，GitHub Actions 会自动构建并部署。

## 待优化项

- [ ] 季节背景渐变替换为实际图片
- [ ] 粒子效果替换为 tsparticles 库（已安装但存在兼容性问题）
- [ ] 增加节气详情卡片弹窗
- [ ] 增加音效背景
- [ ] 移动端适配优化

## License

MIT
