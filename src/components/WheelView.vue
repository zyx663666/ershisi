<template>
  <!-- 轮盘容器：根据当前季节显示不同背景渐变 -->
  <div class="wheel-container" :style="{ background: currentBackground }">
    <!-- 粒子效果容器 -->
    <div id="tsparticles"></div>

    <!-- 轮盘装饰层（包含背景圆和径向线，会执行旋转动画） -->
    <div class="wheel-decorations" ref="wheelRef">
      <!-- 半圆背景 -->
      <div class="wheel-circle-bg"></div>
      <!-- 24条径向装饰线 -->
      <div
        v-for="i in 24"
        :key="i"
        class="wheel-line"
        :style="getLineStyle(i - 1)"
      ></div>
    </div>

    <!-- 节气文字层（固定不动，始终正向显示） -->
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

    <!-- 中心显示区：当前节气名称和拼音 -->
    <div class="center-display">
      <div class="current-name">{{ terms[currentIndex].name }}</div>
      <div class="current-pinyin">{{ terms[currentIndex].pinyin }}</div>
    </div>

    <!-- 节气描述区：显示在轮盘上方，带淡入动画 -->
    <div class="term-description" :key="currentIndex">
      {{ terms[currentIndex].description }}
    </div>

    <!-- 自动播放按钮 -->
    <button 
      class="auto-play-btn"
      :class="{ 'is-playing': isAutoPlaying }"
      @click="toggleAutoPlay"
    >
      {{ isAutoPlaying ? '⏸ 暂停' : '▶ 自动播放' }}
    </button>
  </div>
</template>

<script setup>
/**
 * 轮盘视图组件
 * 功能：
 * - 底部半圆形节气轮盘展示
 * - 逆时针旋转切换节气
 * - 根据季节变换背景和粒子效果
 * - 点击节气或自动播放切换
 */
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { terms } from '../data/terms.js'
import gsap from 'gsap'

// ==================== 响应式变量 ====================
// 当前选中的节气索引（从0开始）
const currentIndex = ref(0)
// 轮盘装饰层的 DOM 引用（用于 GSAP 旋转动画）
const wheelRef = ref(null)
// 当前轮盘旋转角度（实时更新以计算文字位置）
const rotationAngle = ref(0)
// 是否正在自动播放
const isAutoPlaying = ref(false)
// 自动播放的定时器 ID
let autoPlayInterval = null

// ==================== 背景配置 ====================
// 四季对应的背景渐变色
const backgrounds = {
  '春': 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
  '夏': 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
  '秋': 'linear-gradient(135deg, #ff8f00 0%, #ffa000 50%, #ffb300 100%)',
  '冬': 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)'
}

// 根据当前节气季节计算背景
const currentBackground = computed(() => {
  return backgrounds[terms[currentIndex.value].season] || backgrounds['春']
})

// ==================== 粒子系统配置 ====================
// 四季对应的粒子颜色
const particleColors = {
  '春': ['#ffb7c5', '#ff8fa3', '#ffc0cb', '#ff91a4'],  // 粉色花瓣
  '夏': ['#ffeb3b', '#fff176', '#fff59d', '#ffee58'],  // 黄色萤火虫
  '秋': ['#ff5722', '#ff9800', '#ffb74d', '#ffcc80'],  // 橙色落叶
  '冬': ['#ffffff', '#e1f5fe', '#b3e5fc', '#e0f7fa']   // 白色雪花
}

// 粒子类：模拟四季飘落效果
class Particle {
  constructor(x, y, color) {
    this.x = x                          // x 坐标
    this.y = y                          // y 坐标
    this.color = color                  // 粒子颜色
    this.size = Math.random() * 4 + 2   // 粒子大小
    this.speedX = (Math.random() - 0.5) * 2  // 水平速度
    this.speedY = Math.random() * 3 + 1     // 垂直速度
    this.opacity = Math.random() * 0.5 + 0.5  // 透明度
    this.wobble = Math.random() * Math.PI * 2  // 摆动相位
    this.wobbleSpeed = Math.random() * 0.05 + 0.02  // 摆动速度
  }

  // 更新粒子位置
  update() {
    this.wobble += this.wobbleSpeed
    this.x += this.speedX + Math.sin(this.wobble) * 0.5
    this.y += this.speedY
    
    // 粒子超出屏幕底部时重置到顶部
    if (this.y > window.innerHeight) {
      this.y = -10
      this.x = Math.random() * window.innerWidth
    }
    
    // 左右边界循环
    if (this.x < 0) this.x = window.innerWidth
    if (this.x > window.innerWidth) this.x = 0
  }

  // 绘制粒子
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

// Canvas 元素引用
let canvasEl = null
// 动画帧 ID（用于取消动画）
let animationFrameId = null
// 粒子数组
let particles = []

// 初始化粒子系统
function initParticles() {
  const container = document.getElementById('tsparticles')
  if (!container) return
  
  // 创建 Canvas 元素
  canvasEl = document.createElement('canvas')
  canvasEl.width = window.innerWidth
  canvasEl.height = window.innerHeight
  canvasEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;'
  container.appendChild(canvasEl)
  
  // 根据当前季节获取粒子颜色
  const season = terms[currentIndex.value].season
  const colors = particleColors[season] || particleColors['春']
  
  // 创建 50 个粒子
  particles = []
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvasEl.width
    const y = Math.random() * canvasEl.height
    const color = colors[Math.floor(Math.random() * colors.length)]
    particles.push(new Particle(x, y, color))
  }
  
  // 开始动画循环
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

// 更新粒子（切换季节时调用）
function updateParticles() {
  const season = terms[currentIndex.value].season
  const colors = particleColors[season] || particleColors['春']
  
  particles.forEach(particle => {
    particle.color = colors[Math.floor(Math.random() * colors.length)]
    // 根据季节调整速度和大小
    particle.speedY = season === '秋' ? 3 : (season === '冬' ? 1.5 : 2)
    particle.size = season === '秋' ? (Math.random() * 4 + 3) : (Math.random() * 4 + 2)
  })
}

// 处理窗口大小变化
function handleResize() {
  if (canvasEl) {
    canvasEl.width = window.innerWidth
    canvasEl.height = window.innerHeight
  }
}

// ==================== 生命周期钩子 ====================
onMounted(() => {
  initParticles()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理定时器
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
  // 取消动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})

// 监听 currentIndex 变化以更新粒子
watch(currentIndex, () => {
  updateParticles()
})

// ==================== 样式计算函数 ====================
// 计算径向线的旋转角度
const getLineStyle = (index) => {
  const angle = (index * 360) / 24
  return {
    transform: `rotate(${angle}deg)`
  }
}

// 计算每个节气文字的位置
// 由于文字层不旋转，需要根据当前旋转角度计算偏移
const getTermStyle = (index) => {
  // 偏移角度 = 节气基础角度 - 当前旋转角度
  const offsetAngle = index * 15 - rotationAngle.value
  const radian = (offsetAngle * Math.PI) / 180
  const radius = 42  // 半径（相对于视口百分比，配合 90vmin 轮盘）

  // 计算圆周上的点位置
  // 圆心在 (50%, 100% + 偏移)，即页面底部中央偏下
  const x = 50 + radius * Math.sin(radian)
  const y = 100 - radius * Math.cos(radian) + 3.5  // 向下偏移约10px

  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)'
  }
}

// ==================== 事件处理 ====================
// 处理节气点击
const handleTermClick = (index) => {
  if (index === currentIndex.value) return
  // 如果正在自动播放，点击时停止
  if (isAutoPlaying.value) {
    toggleAutoPlay()
  }
  currentIndex.value = index
}

// 监听 currentIndex 变化，执行轮盘旋转动画
watch(currentIndex, (newIndex) => {
  // 每个节气间隔 15 度（360 / 24）
  const targetAngle = newIndex * 15
  
  // GSAP 旋转动画
  gsap.to(wheelRef.value, {
    rotation: targetAngle,           // 目标旋转角度
    duration: 1.2,                  // 动画持续时间（秒）
    ease: "power2.inOut",           // 缓动效果：加速进入，减速结束
    onUpdate: () => {
      // 动画更新时同步 rotationAngle，以便计算文字位置
      rotationAngle.value = gsap.getProperty(wheelRef.value, "rotation")
    }
  })
})

// 切换自动播放状态
const toggleAutoPlay = () => {
  isAutoPlaying.value = !isAutoPlaying.value
  
  if (isAutoPlaying.value) {
    // 开始自动播放：每 5 秒切换到下一个节气
    autoPlayInterval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % 24
    }, 5000)
  } else {
    // 停止自动播放
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      autoPlayInterval = null
    }
  }
}
</script>

<style scoped>
/* ==================== 容器样式 ==================== */
.wheel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  transition: background 1.5s ease-in-out;  /* 背景切换过渡 */
  font-family: 'Noto Serif SC', serif;       /* 使用思源宋体 */
}

/* 粒子容器 */
#tsparticles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* ==================== 轮盘装饰层样式 ==================== */
.wheel-decorations {
  position: absolute;
  width: 150vmin;         /* 宽度：视口最小边的 90% */
  height: 150vmin;
  left: 50%;
  bottom: -120vmin;    /* 圆心向下移动一个半径距离 */
  transform: translateX(-50%);
  z-index: 10;
}

/* 半圆背景 */
.wheel-circle-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid #8b7355;  /* 加粗边框 */
  background: linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(240,235,227,0.95) 100%);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), inset 0 3px 10px rgba(255,255,255,0.8);
}

/* 径向装饰线 */
.wheel-line {
  position: absolute;
  width: 3px;
  height: 50%;            /* 半径的一半 */
  left: 50%;
  top: 0;
  background: linear-gradient(to bottom, #8b7355 0%, #c4a77d 100%);
  transform-origin: bottom center;  /* 以底部为旋转中心 */
  opacity: 0.7;
}

/* ==================== 节气文字层样式 ==================== */
.wheel-terms {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;   /* 不拦截鼠标事件 */
  z-index: 20;
}

.wheel-term {
  position: absolute;
  font-size: 20px;
  color: rgba(80, 70, 60, 0.6);
  white-space: nowrap;
  pointer-events: auto;   /* 可点击 */
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

/* 当前节气高亮样式 */
.wheel-term.is-current {
  font-size: 28px;
  color: #d4a84b;
  font-weight: 700;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

/* ==================== 中心显示区样式 ==================== */
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
  font-size: 64px;       /* 调大字体以适配更大的轮盘 */
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

/* ==================== 节气描述区样式 ==================== */
.term-description {
  position: fixed;
  top: calc(100% - 90vmin - 60px);  /* 位于更大轮盘上方 */
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
  animation: fadeIn 0.8s ease-out;  /* 淡入动画 */
  max-width: 80%;
  white-space: nowrap;
}

/* 淡入动画关键帧 */
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

/* ==================== 自动播放按钮样式 ==================== */
.auto-play-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;
  padding: 14px 28px;
  font-size: 16px;
  font-family: 'Noto Serif SC', serif;
  font-weight: 600;
  color: #4a3f35;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #8b7355;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.auto-play-btn:hover {
  background: #8b7355;
  color: white;
  transform: scale(1.05);
}

/* 播放中状态样式 */
.auto-play-btn.is-playing {
  background: #d4a84b;
  color: white;
  border-color: #d4a84b;
}

.auto-play-btn.is-playing:hover {
  background: #c49a3d;
}
</style>
