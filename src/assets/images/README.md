# 图片资源目录

此文件夹用于存放二十四节气项目的图片资源。

## 目录结构建议

```
images/
├── backgrounds/     # 季节背景图片
│   ├── spring.jpg    # 春季背景
│   ├── summer.jpg   # 夏季背景
│   ├── autumn.jpg   # 秋季背景
│   └── winter.jpg   # 冬季背景
├── particles/       # 粒子效果图片（如有使用）
│   ├── petal.png    # 花瓣
│   ├── firefly.png  # 萤火虫
│   ├── leaf.png     # 落叶
│   └── snow.png     # 雪花
└── icons/           # 图标资源（如有使用）
```

## 使用方式

在 Vue 组件中引用：

```javascript
import springBg from '@/assets/images/backgrounds/spring.jpg'

// 或在 CSS 中使用
background-image: url('@/assets/images/backgrounds/spring.jpg')
```
