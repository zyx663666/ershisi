<template>
  <div class="wheel-container" :style="{ background: currentBackground }">
    <div id="tsparticles"></div>

    <!-- 顶部导航栏（圆角矩形、半透明、80%宽度） -->
    <nav class="top-nav">
      <div class="nav-logo" @click="$emit('navigate', 'home')" style="cursor:pointer">二十四节气</div>
      <div class="nav-links">
        <a href="#" class="nav-link active" @click.prevent="$emit('navigate', 'home')">首页</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'terms')">节气介绍</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'culture')">传统文化</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'poetry')">诗词歌赋</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'farming')">农事指南</a>
      </div>
    </nav>

    <!-- 轮盘装饰层（包含背景圆、径向线、节气文字和图片，会执行旋转动画） -->
    <div class="wheel-decorations" ref="wheelRef">
      <div class="wheel-circle-bg"></div>
      <div
        v-for="i in 24"
        :key="i"
        class="wheel-line"
        :style="getLineStyle(i - 1)"
      ></div>
      <div
        v-for="(term, index) in terms"
        :key="'img-' + term.name"
        class="wheel-image"
        :class="{ 'is-current-image': index === currentIndex }"
        :style="getImageStyle(index)"
      >
        <img :src="getImagePath(term.name)" :alt="term.name" />
      </div>
      <!-- 节气文字层（作为圆的子类，随圆一起旋转） -->
      <div class="wheel-terms">
        <div
          v-for="(term, index) in terms"
          :key="term.name"
          class="wheel-term"
          :class="{ 'is-current': index === currentIndex }"
          :style="getTermStyle(index)"
          @click="handleTermClick(index)"
        >
          {{ term.name }}
        </div>
      </div>
    </div>

    <!-- 中心显示区：当前节气名称和拼音 -->
    <div class="center-display">
      <div class="current-name">{{ terms[currentIndex].name }}</div>
      <div class="current-pinyin">{{ terms[currentIndex].pinyin }}</div>
    </div>

    <!-- 节气描述区 -->
    <div class="term-description" :key="currentIndex">
      {{ terms[currentIndex].description }}
    </div>

    <!-- 右下角控制面板 -->
    <div class="control-panel">
      <div class="panel-title">控制面板</div>
      <div class="panel-section">
        <label>旋转速度</label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          v-model="rotationSpeed" 
          class="slider"
        />
        <span>{{ rotationSpeed }}x</span>
      </div>
      <div class="panel-section">
        <label>旋转方向</label>
        <div class="btn-group">
          <button 
            :class="{ active: rotationDirection === 'clockwise' }"
            @click="rotationDirection = 'clockwise'"
          >顺时针</button>
          <button 
            :class="{ active: rotationDirection === 'counterclockwise' }"
            @click="rotationDirection = 'counterclockwise'"
          >逆时针</button>
        </div>
      </div>
      <div class="panel-section">
        <button 
          class="control-btn"
          :class="{ 'is-playing': isAutoPlaying }"
          @click="toggleAutoPlay"
        >
          {{ isAutoPlaying ? ' 暂停' : '▶ 自动播放' }}
        </button>
      </div>
      <div class="panel-section">
        <button class="control-btn" @click="resetRotation">重置位置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { terms } from '../data/terms.js'
import gsap from 'gsap'

// 声明组件事件：向父组件发送页面导航事件
defineEmits(['navigate'])

// ==================== 响应式状态变量 ====================
const currentIndex = ref(0) // 当前选中的节气索引（0-23）
const wheelRef = ref(null) // 轮盘DOM元素引用
const rotationAngle = ref(0) // 当前轮盘旋转角度
const isAutoPlaying = ref(false) // 是否自动播放
let autoPlayInterval = null // 自动播放定时器

const rotationSpeed = ref(3) // 旋转速度倍率（1-10）
const rotationDirection = ref('counterclockwise') // 旋转方向：默认逆时针

// ==================== 四季背景色映射 ====================
const backgrounds = {
  '春': 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
  '夏': 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
  '秋': 'linear-gradient(135deg, #ff8f00 0%, #ffa000 50%, #ffb300 100%)',
  '冬': 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)'
}

// 根据当前节气的季节计算背景色
const currentBackground = computed(() => {
  return backgrounds[terms[currentIndex.value].season] || backgrounds['春']
})

// ==================== 粒子系统颜色配置 ====================
const particleColors = {
  '春': ['#ffb7c5', '#ff8fa3', '#ffc0cb', '#ff91a4'],
  '夏': ['#ffeb3b', '#fff176', '#fff59d', '#ffee58'],
  '秋': ['#ff5722', '#ff9800', '#ffb74d', '#ffcc80'],
  '冬': ['#ffffff', '#e1f5fe', '#b3e5fc', '#e0f7fa']
}

// ==================== 粒子类 ====================
// 用于在背景中生成飘浮的粒子动画效果，模拟花瓣/落叶/雪花等
class Particle {
  constructor(x, y, color) {
    this.x = x // 粒子x坐标
    this.y = y // 粒子y坐标
    this.color = color // 粒子颜色
    this.size = Math.random() * 4 + 2 // 粒子大小（2-6像素）
    this.speedX = (Math.random() - 0.5) * 2 // 水平漂移速度
    this.speedY = Math.random() * 3 + 1 // 垂直下落速度
    this.opacity = Math.random() * 0.5 + 0.5 // 透明度（0.5-1）
    this.wobble = Math.random() * Math.PI * 2 // 左右摇摆相位
    this.wobbleSpeed = Math.random() * 0.05 + 0.02 // 左右摇摆速度
  }

  // 更新粒子位置
  update() {
    this.wobble += this.wobbleSpeed
    this.x += this.speedX + Math.sin(this.wobble) * 0.5 // 加入正弦摇摆效果
    this.y += this.speedY
    // 粒子超出屏幕底部时，从顶部重新生成
    if (this.y > window.innerHeight) {
      this.y = -10
      this.x = Math.random() * window.innerWidth
    }
    // 粒子超出屏幕左右时，从另一侧出现
    if (this.x < 0) this.x = window.innerWidth
    if (this.x > window.innerWidth) this.x = 0
  }

  // 在canvas上绘制粒子
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

// ==================== Canvas粒子动画相关变量 ====================
let canvasEl = null // canvas元素
let animationFrameId = null // 动画帧ID
let particles = [] // 粒子数组

// 初始化粒子系统
function initParticles() {
  const container = document.getElementById('tsparticles')
  if (!container) return
  canvasEl = document.createElement('canvas')
  canvasEl.width = window.innerWidth
  canvasEl.height = window.innerHeight
  canvasEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;'
  container.appendChild(canvasEl)
  const season = terms[currentIndex.value].season
  const colors = particleColors[season] || particleColors['春']
  particles = []
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvasEl.width
    const y = Math.random() * canvasEl.height
    const color = colors[Math.floor(Math.random() * colors.length)]
    particles.push(new Particle(x, y, color))
  }
  animateParticles()
}

// 粒子动画循环
function animateParticles() {
  if (!canvasEl) return
  const ctx = canvasEl.getContext('2d')
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  particles.forEach(particle => {
    particle.update()
    particle.draw(ctx)
  })
  animationFrameId = requestAnimationFrame(animateParticles)
}

// 根据季节更新粒子的颜色和行为
function updateParticles() {
  const season = terms[currentIndex.value].season
  const colors = particleColors[season] || particleColors['春']
  particles.forEach(particle => {
    particle.color = colors[Math.floor(Math.random() * colors.length)]
    particle.speedY = season === '秋' ? 3 : (season === '冬' ? 1.5 : 2)
    particle.size = season === '秋' ? (Math.random() * 4 + 3) : (Math.random() * 4 + 2)
  })
}

// 窗口大小变化时重新设置canvas尺寸
function handleResize() {
  if (canvasEl) {
    canvasEl.width = window.innerWidth
    canvasEl.height = window.innerHeight
  }
}

// ==================== Vue生命周期钩子 ====================
onMounted(() => {
  initParticles()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理自动播放定时器
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
  // 取消粒子动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
})

// 监听当前节气变化，更新粒子颜色
watch(currentIndex, () => {
  updateParticles()
})

// ==================== 轮盘样式计算函数 ====================

// 计算24条径向线的旋转角度（每条线间隔15度）
const getLineStyle = (index) => {
  const angle = (index * 360) / 24
  return {
    transform: `rotate(${angle}deg)`
  }
}

// 计算节气文字在圆上的位置（从3点钟方向开始，顺时针排列）
// 反向旋转保持文字自身不随圆旋转
const getTermStyle = (index) => {
  const angle = 90 + index * 15 // 从3点钟方向(90°)开始，每个节气间隔15度
  const radian = (angle * Math.PI) / 180
  const radius = 45 // 文字距离圆心的半径百分比

  const x = 50 + radius * Math.sin(radian)
  const y = 50 - radius * Math.cos(radian)

  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${-rotationAngle.value}deg)` // 反向旋转抵消圆的旋转，保持文字自身不转
  }
}

// 计算图片位置样式（从3点钟方向开始，顺时针排列）
// 反向旋转保持图片自身不转，当前选中图片向右移动20px
const getImageStyle = (index) => {
  const angle = 90 + index * 15 // 从3点钟方向(90°)开始，每个图片间隔15度
  const radian = (angle * Math.PI) / 180
  const radius = 30 // 图片距离圆心的半径百分比

  const x = 50 + radius * Math.sin(radian)
  const y = 50 - radius * Math.cos(radian)

  // 当前选中图片向右额外移动20px
  const extraTranslate = index === currentIndex.value ? 'translateX(20px)' : ''

  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${-rotationAngle.value}deg) ${extraTranslate}` // 反向旋转抵消圆的旋转，保持图片自身不转
  }
}

// 获取节气对应图片的路径
const getImagePath = (name) => {
  return new URL(`../assets/images/${name}.png`, import.meta.url).href
}

// ==================== 交互处理函数 ====================

// 点击节气文字切换当前节气
const handleTermClick = (index) => {
  if (index === currentIndex.value) return // 点击相同节气不处理
  if (isAutoPlaying.value) {
    toggleAutoPlay() // 手动点击时自动停止自动播放
  }
  currentIndex.value = index
}

// 监听currentIndex变化，通过GSAP动画逆时针旋转轮盘
// 逆时针旋转使当前节气到达3点钟方向（最右边）
watch(currentIndex, (newIndex) => {
  const targetAngle = -newIndex * 15 // 逆时针旋转，每个节气对应-15度
  gsap.to(wheelRef.value, {
    rotation: targetAngle,
    duration: 1.2,
    ease: "power2.inOut",
    onUpdate: () => {
      rotationAngle.value = gsap.getProperty(wheelRef.value, "rotation") // 实时更新旋转角度
    }
  })
})

// 切换自动播放状态
const toggleAutoPlay = () => {
  isAutoPlaying.value = !isAutoPlaying.value
  if (isAutoPlaying.value) {
    autoPlayInterval = setInterval(() => {
      if (rotationDirection.value === 'clockwise') {
        currentIndex.value = (currentIndex.value + 1) % 24 // 顺时针：索引+1
      } else {
        currentIndex.value = (currentIndex.value - 1 + 24) % 24 // 逆时针：索引-1，加24防止负数
      }
    }, 5000 / rotationSpeed.value) // 基础间隔5秒，除以速度倍率
  } else {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      autoPlayInterval = null
    }
  }
}

// 重置轮盘到初始位置（立春）
const resetRotation = () => {
  currentIndex.value = 0
  gsap.to(wheelRef.value, {
    rotation: 0,
    duration: 0.8,
    ease: "power2.inOut",
    onUpdate: () => {
      rotationAngle.value = gsap.getProperty(wheelRef.value, "rotation")
    }
  })
}
</script>

<style scoped>
.wheel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  transition: background 1.5s ease-in-out;
  font-family: 'Noto Serif SC', serif;
}

#tsparticles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* ==================== 顶部导航栏 ==================== */
.top-nav {
  position: fixed;
  top: 15px; /* 距离顶部留出间距 */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 居中对齐 */
  width: 80%; /* 横向占比80% */
  height: 50px;
  background: rgba(100, 180, 255, 0.1); /* 透明度10% */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px);
  border-radius: 25px; /* 圆角矩形 */
  display: flex;
  align-items: center;
  padding: 0 30px;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* 轻微阴影 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 半透明边框 */
}

.nav-logo {
  font-size: 20px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9); /* 半透明背景下的文字颜色 */
  margin-right: 30px;
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); /* 文字阴影增强可读性 */
}

.nav-links {
  display: flex;
  gap: 8px;
  flex: 1;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8); /* 半透明背景下的链接颜色 */
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* 文字阴影增强可读性 */
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 600;
}

/* ==================== 轮盘装饰层 ==================== */
.wheel-decorations {
  position: absolute;
  width: 120vmin;
  height: 120vmin;
  left: -45%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.wheel-circle-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid transparent; /* 圆形边框透明，不显示包裹 */
  background: transparent; /* 圆形背景透明 */
  box-shadow: none; /* 移除阴影 */
}

.wheel-line {
  position: absolute;
  width: 3px;
  height: 50%;
  left: 50%;
  top: 50%;
  margin-left: -1.5px;
  margin-top: -25%;
  background: linear-gradient(to top, #8b7355 0%, #c4a77d 100%);
  transform-origin: center center;
  opacity: 0.7;
}

/* ==================== 图片层 ==================== */
.wheel-image {
  position: absolute;
  width: 16vmin; /* 放大一倍后的尺寸 */
  height: 16vmin; /* 放大一倍后的尺寸 */
  pointer-events: none;
  transition: width 0.6s ease, height 0.6s ease; /* 尺寸变化的平滑过渡 */
  z-index: 15;
}

/* 当前选中的图片：放大3倍（基于原始8vmin的3倍） */
.wheel-image.is-current-image {
  width: 24vmin; /* 原始8vmin × 3 */
  height: 24vmin; /* 原始8vmin × 3 */
  z-index: 25; /* 提升层级，确保在其他图片之上 */
}

.wheel-image img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持图片比例，不裁剪 */
}

/* ==================== 节气文字层 ==================== */
.wheel-terms {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

.wheel-term {
  position: absolute;
  font-size: 20px;
  color: rgba(80, 70, 60, 0.6);
  white-space: nowrap;
  pointer-events: auto;
  cursor: pointer;
  transition: color 0.3s ease, font-size 0.3s ease, text-shadow 0.3s ease;
  padding: 6px 10px;
  user-select: none;
  font-weight: 500;
}

.wheel-term:hover {
  color: rgba(80, 70, 60, 0.95);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.wheel-term.is-current {
  font-size: 28px;
  color: #d4a84b;
  font-weight: 700;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

/* ==================== 中心显示区 ==================== */
.center-display {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 30;
  pointer-events: none;
}

.current-name {
  font-size: 64px;
  font-weight: 700;
  color: #4a3f35;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 10px;
}

.current-pinyin {
  font-size: 24px;
  color: #8b7355;
  margin-top: 12px;
  letter-spacing: 4px;
}

/* ==================== 节气描述区 ==================== */
.term-description {
  position: fixed;
  top: calc(50% + 60vmin + 30px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 22px;
  color: #5c4d3d;
  text-align: center;
  z-index: 40;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease-out;
  max-width: 80%;
  white-space: nowrap;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* ==================== 右下角控制面板 ==================== */
.control-panel {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 220px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  z-index: 100;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  color: #4a3f35;
  margin-bottom: 16px;
  text-align: center;
  border-bottom: 2px solid #e0d5c5;
  padding-bottom: 10px;
}

.panel-section {
  margin-bottom: 14px;
}

.panel-section label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.slider {
  width: 100%;
  accent-color: #8b7355;
}

.btn-group {
  display: flex;
  gap: 6px;
}

.btn-group button {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #d0c5b5;
  border-radius: 8px;
  background: #fff;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-group button.active {
  background: #8b7355;
  color: #fff;
  border-color: #8b7355;
}

.control-btn {
  width: 100%;
  padding: 10px 16px;
  border: 2px solid #8b7355;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #4a3f35;
  font-size: 14px;
  font-family: 'Noto Serif SC', serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background: #8b7355;
  color: #fff;
}

.control-btn.is-playing {
  background: #d4a84b;
  color: #fff;
  border-color: #d4a84b;
}
</style>
