<template>
  <div class="wheel-container" :style="{ background: currentBackground }">
    <div id="tsparticles"></div>

    <!-- 顶部导航栏 -->
    <nav class="top-nav">
      <div class="nav-logo" @click="$emit('navigate', 'home')" style="cursor:pointer">二十四节气</div>
      <div class="nav-links">
        <a href="#" class="nav-link active" @click.prevent="$emit('navigate', 'home')">首页</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'terms')">节气介绍</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'culture')">传统文化</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'poetry')">诗词歌赋</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'farming')">农事指南</a>
      </div>
      <div class="nav-search">
        <input type="text" placeholder="搜索节气..." />
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

defineEmits(['navigate'])

const currentIndex = ref(0)
const wheelRef = ref(null)
const rotationAngle = ref(0)
const isAutoPlaying = ref(false)
let autoPlayInterval = null

const rotationSpeed = ref(3)
const rotationDirection = ref('clockwise')

const backgrounds = {
  '春': 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
  '夏': 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
  '秋': 'linear-gradient(135deg, #ff8f00 0%, #ffa000 50%, #ffb300 100%)',
  '冬': 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)'
}

const currentBackground = computed(() => {
  return backgrounds[terms[currentIndex.value].season] || backgrounds['春']
})

const particleColors = {
  '春': ['#ffb7c5', '#ff8fa3', '#ffc0cb', '#ff91a4'],
  '夏': ['#ffeb3b', '#fff176', '#fff59d', '#ffee58'],
  '秋': ['#ff5722', '#ff9800', '#ffb74d', '#ffcc80'],
  '冬': ['#ffffff', '#e1f5fe', '#b3e5fc', '#e0f7fa']
}

class Particle {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    this.size = Math.random() * 4 + 2
    this.speedX = (Math.random() - 0.5) * 2
    this.speedY = Math.random() * 3 + 1
    this.opacity = Math.random() * 0.5 + 0.5
    this.wobble = Math.random() * Math.PI * 2
    this.wobbleSpeed = Math.random() * 0.05 + 0.02
  }

  update() {
    this.wobble += this.wobbleSpeed
    this.x += this.speedX + Math.sin(this.wobble) * 0.5
    this.y += this.speedY
    if (this.y > window.innerHeight) {
      this.y = -10
      this.x = Math.random() * window.innerWidth
    }
    if (this.x < 0) this.x = window.innerWidth
    if (this.x > window.innerWidth) this.x = 0
  }

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

let canvasEl = null
let animationFrameId = null
let particles = []

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

function updateParticles() {
  const season = terms[currentIndex.value].season
  const colors = particleColors[season] || particleColors['春']
  particles.forEach(particle => {
    particle.color = colors[Math.floor(Math.random() * colors.length)]
    particle.speedY = season === '秋' ? 3 : (season === '冬' ? 1.5 : 2)
    particle.size = season === '秋' ? (Math.random() * 4 + 3) : (Math.random() * 4 + 2)
  })
}

function handleResize() {
  if (canvasEl) {
    canvasEl.width = window.innerWidth
    canvasEl.height = window.innerHeight
  }
}

onMounted(() => {
  initParticles()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
})

watch(currentIndex, () => {
  updateParticles()
})

const getLineStyle = (index) => {
  const angle = (index * 360) / 24
  return {
    transform: `rotate(${angle}deg)`
  }
}

const getTermStyle = (index) => {
  const angle = index * 15
  const radian = (angle * Math.PI) / 180
  const radius = 45

  const x = 50 + radius * Math.sin(radian)
  const y = 50 - radius * Math.cos(radian)

  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)'
  }
}

const getImageStyle = (index) => {
  const angle = index * 15
  const radian = (angle * Math.PI) / 180
  const radius = 30

  const x = 50 + radius * Math.sin(radian)
  const y = 50 - radius * Math.cos(radian)

  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)'
  }
}

const getImagePath = (name) => {
  return new URL(`../assets/images/${name}.png`, import.meta.url).href
}

const handleTermClick = (index) => {
  if (index === currentIndex.value) return
  if (isAutoPlaying.value) {
    toggleAutoPlay()
  }
  currentIndex.value = index
}

watch(currentIndex, (newIndex) => {
  const targetAngle = newIndex * 15
  gsap.to(wheelRef.value, {
    rotation: targetAngle,
    duration: 1.2,
    ease: "power2.inOut",
    onUpdate: () => {
      rotationAngle.value = gsap.getProperty(wheelRef.value, "rotation")
    }
  })
})

const toggleAutoPlay = () => {
  isAutoPlaying.value = !isAutoPlaying.value
  if (isAutoPlaying.value) {
    autoPlayInterval = setInterval(() => {
      if (rotationDirection.value === 'clockwise') {
        currentIndex.value = (currentIndex.value + 1) % 24
      } else {
        currentIndex.value = (currentIndex.value - 1 + 24) % 24
      }
    }, 5000 / rotationSpeed.value)
  } else {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      autoPlayInterval = null
    }
  }
}

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
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(100, 180, 255, 0.95);
  display: flex;
  align-items: center;
  padding: 0 30px;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-logo {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-right: 40px;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  gap: 8px;
  flex: 1;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-weight: 600;
}

.nav-search input {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 14px;
  outline: none;
  width: 180px;
}

.nav-search input::placeholder {
  color: rgba(255, 255, 255, 0.7);
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
  border: 5px solid #8b7355;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,235,227,0.95) 100%);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), inset 0 3px 10px rgba(255,255,255,0.8);
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

.wheel-image {
  position: absolute;
  width: 8vmin;
  height: 8vmin;
  border-radius: 50%;
  overflow: hidden;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.wheel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
