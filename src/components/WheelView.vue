<template>
  <div class="wheel-container" :class="'bg-' + terms[currentIndex].season" @mousemove="handleMouseMove" @navigate="$emit('navigate', $event)">
    <div id="tsparticles"></div>

    <!-- SVG几何装饰层（山水/祥云/竹叶/荷花的极简线稿） -->
    <svg class="deco-svg deco-svg-1" viewBox="0 0 200 200" fill="none">
      <path d="M20 180 Q60 100 100 140 Q140 80 180 120" stroke="rgba(139,115,85,0.08)" stroke-width="1.5" fill="none"/>
      <path d="M10 190 Q50 130 90 160 Q130 110 170 140" stroke="rgba(139,115,85,0.05)" stroke-width="1" fill="none"/>
    </svg>
    <svg class="deco-svg deco-svg-2" viewBox="0 0 120 60" fill="none">
      <path d="M10 50 Q30 10 60 30 Q90 10 110 50" stroke="rgba(139,115,85,0.06)" stroke-width="1.2" fill="none"/>
      <circle cx="60" cy="20" r="8" stroke="rgba(139,115,85,0.04)" stroke-width="0.8" fill="none"/>
    </svg>
    <svg class="deco-svg deco-svg-3" viewBox="0 0 80 160" fill="none">
      <path d="M40 10 L40 150" stroke="rgba(139,115,85,0.05)" stroke-width="1"/>
      <path d="M40 40 Q20 30 15 45" stroke="rgba(139,115,85,0.06)" stroke-width="0.8" fill="none"/>
      <path d="M40 70 Q60 60 65 75" stroke="rgba(139,115,85,0.06)" stroke-width="0.8" fill="none"/>
      <path d="M40 100 Q25 90 20 105" stroke="rgba(139,115,85,0.05)" stroke-width="0.8" fill="none"/>
    </svg>
    <svg class="deco-svg deco-svg-4" viewBox="0 0 100 100" fill="none">
      <path d="M50 10 Q70 30 50 50 Q30 30 50 10" stroke="rgba(139,115,85,0.06)" stroke-width="1" fill="none"/>
      <path d="M50 50 Q70 70 50 90 Q30 70 50 50" stroke="rgba(139,115,85,0.04)" stroke-width="1" fill="none"/>
    </svg>

    <!-- 浮动几何装饰 -->
    <div class="deco-geo deco-geo-1"></div>
    <div class="deco-geo deco-geo-2"></div>
    <div class="deco-geo deco-geo-3"></div>
    <div class="deco-geo deco-geo-4"></div>
    <div class="deco-geo deco-geo-5"></div>
    <div class="deco-geo deco-geo-6"></div>

    <!-- 鼠标跟随光晕 -->
    <div class="cursor-glow" :style="cursorGlowStyle"></div>

    <!-- 顶部导航栏（莫兰迪色毛玻璃） -->
    <nav class="top-nav">
      <div class="nav-logo" @click="$emit('navigate', 'home')">
        <svg class="nav-logo-icon" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="0.8"/>
          <line x1="12" y1="3" x2="12" y2="7" stroke="currentColor" stroke-width="0.8"/>
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="0.8"/>
        </svg>
        <span class="logo-text">二十四节气</span>
      </div>
      <div class="nav-links">
        <a href="#" class="nav-link active" @click.prevent="$emit('navigate', 'home')">首页</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'terms')">节气介绍</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'culture')">传统文化</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'poetry')">诗词歌赋</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'farming')">农事指南</a>
      </div>
    </nav>

    <!-- 轮盘装饰层 -->
    <div class="wheel-decorations" ref="wheelRef">
      <div class="wheel-circle-bg"></div>
      <div class="wheel-ring wheel-ring-outer"></div>
      <div class="wheel-ring wheel-ring-inner"></div>
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
      <div class="wheel-terms">
        <div
          v-for="(term, index) in terms"
          :key="term.name"
          class="wheel-term"
          :class="{ 'is-current': index === currentIndex }"
          :style="getTermStyle(index)"
          @click="handleTermClick(index)"
          @mouseenter="hoveredTerm = index"
          @mouseleave="hoveredTerm = -1"
        >
          <span class="term-dot" :class="{ 'is-visible': hoveredTerm === index || index === currentIndex }"></span>
          {{ term.name }}
        </div>
      </div>
    </div>

    <!-- 中心显示区 -->
    <div class="center-display" :key="'center-' + currentIndex">
      <div class="current-season-badge">{{ terms[currentIndex].season }}</div>
      <div class="current-name">{{ terms[currentIndex].name }}</div>
      <div class="current-pinyin">{{ terms[currentIndex].pinyin }}</div>
      <div class="current-date">{{ terms[currentIndex].date }}</div>
    </div>

    <!-- 节气描述区 -->
    <div class="term-description" :key="currentIndex">
      {{ terms[currentIndex].description }}
    </div>

    <!-- 节气背景图（缩小至页面1/4，放置在节气文字下方） -->
    <div class="term-bg-wrap">
      <img
        class="term-bg-image"
        :src="getBgPath(terms[currentIndex].name)"
        :alt="terms[currentIndex].name"
      />
    </div>

    <!-- 右下角控制面板 -->
    <div class="control-panel">
      <div class="panel-title">
        <svg class="panel-icon-svg" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1"/>
          <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="0.8"/>
          <line x1="10" y1="3" x2="10" y2="5.5" stroke="currentColor" stroke-width="0.8"/>
          <line x1="10" y1="14.5" x2="10" y2="17" stroke="currentColor" stroke-width="0.8"/>
          <line x1="3" y1="10" x2="5.5" y2="10" stroke="currentColor" stroke-width="0.8"/>
          <line x1="14.5" y1="10" x2="17" y2="10" stroke="currentColor" stroke-width="0.8"/>
        </svg>
        控制面板
      </div>
      <div class="panel-section">
        <label>旋转速度</label>
        <input type="range" min="1" max="10" v-model="rotationSpeed" class="slider" />
        <span class="speed-value">{{ rotationSpeed }}x</span>
      </div>
      <div class="panel-section">
        <label>旋转方向</label>
        <div class="btn-group">
          <button :class="{ active: rotationDirection === 'clockwise' }" @click="rotationDirection = 'clockwise'">顺时针</button>
          <button :class="{ active: rotationDirection === 'counterclockwise' }" @click="rotationDirection = 'counterclockwise'">逆时针</button>
        </div>
      </div>
      <div class="panel-section">
        <button class="control-btn" :class="{ 'is-playing': isAutoPlaying }" @click="toggleAutoPlay">
          {{ isAutoPlaying ? '⏸ 暂停' : '▶ 自动播放' }}
        </button>
      </div>
      <div class="panel-section">
        <button class="control-btn control-btn-reset" @click="resetRotation">↺ 重置位置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, reactive } from 'vue'
import { terms } from '../data/terms.js'
import gsap from 'gsap'

defineEmits(['navigate'])

const currentIndex = ref(0)
const wheelRef = ref(null)
const rotationAngle = ref(0)
const isAutoPlaying = ref(false)
let autoPlayInterval = null

const rotationSpeed = ref(3)
const rotationDirection = ref('counterclockwise')
const hoveredTerm = ref(-1)

const mousePos = reactive({ x: 0.5, y: 0.5 })

const handleMouseMove = (e) => {
  mousePos.x = e.clientX / window.innerWidth
  mousePos.y = e.clientY / window.innerHeight
}

const cursorGlowStyle = computed(() => ({
  left: `${mousePos.x * 100}%`,
  top: `${mousePos.y * 100}%`
}))

const getBgPath = (name) => {
  return new URL(`../assets/images/背景${name}.png`, import.meta.url).href
}

const particleColors = {
  '春': ['#d4a0a0', '#c9918f', '#dbb5b5', '#cfa8a8'],
  '夏': ['#a8b8a0', '#9aab8f', '#b5c4a8', '#a3b498'],
  '秋': ['#c4a878', '#b89868', '#d0b488', '#c4a070'],
  '冬': ['#c8d0d8', '#b8c4d0', '#d0d8e0', '#bcc8d4']
}

class Particle {
  constructor(x, y, color, season) {
    this.x = x
    this.y = y
    this.color = color
    this.season = season
    this.size = Math.random() * 4 + 2
    this.speedX = (Math.random() - 0.5) * 2
    this.speedY = Math.random() * 3 + 1
    this.opacity = Math.random() * 0.35 + 0.15
    this.wobble = Math.random() * Math.PI * 2
    this.wobbleSpeed = Math.random() * 0.05 + 0.02
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 2
  }

  update() {
    this.wobble += this.wobbleSpeed
    this.rotation += this.rotationSpeed
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
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.fillStyle = this.color

    if (this.season === '春') {
      this.drawPetal(ctx)
    } else if (this.season === '秋') {
      this.drawLeaf(ctx)
    } else if (this.season === '冬') {
      this.drawSnowflake(ctx)
    } else {
      ctx.beginPath()
      ctx.arc(0, 0, this.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  drawPetal(ctx) {
    ctx.beginPath()
    ctx.ellipse(0, 0, this.size * 0.5, this.size * 1.3, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  drawLeaf(ctx) {
    const s = this.size
    ctx.beginPath()
    ctx.moveTo(0, -s * 1.5)
    ctx.quadraticCurveTo(s, -s * 0.5, 0, s * 1.5)
    ctx.quadraticCurveTo(-s, -s * 0.5, 0, -s * 1.5)
    ctx.fill()
  }

  drawSnowflake(ctx) {
    const s = this.size * 0.8
    ctx.strokeStyle = this.color
    ctx.lineWidth = 0.8
    ctx.globalAlpha = this.opacity * 0.7
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, -s)
      ctx.stroke()
      ctx.rotate(Math.PI / 3)
    }
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
    particles.push(new Particle(x, y, color, season))
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
    particle.season = season
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
  if (autoPlayInterval) clearInterval(autoPlayInterval)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)
})

const getLineStyle = (index) => {
  const angle = (index * 360) / 24
  return { transform: `rotate(${angle}deg)` }
}

const getTermStyle = (index) => {
  const angle = 90 + index * 15
  const radian = (angle * Math.PI) / 180
  const radius = 45
  const x = 50 + radius * Math.sin(radian)
  const y = 50 - radius * Math.cos(radian)
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${-rotationAngle.value}deg)`
  }
}

const getImageStyle = (index) => {
  const angle = 90 + index * 15
  const radian = (angle * Math.PI) / 180
  const radius = 30
  const x = 50 + radius * Math.sin(radian)
  const y = 50 - radius * Math.cos(radian)
  const extraTranslate = index === currentIndex.value ? 'translateX(20px)' : ''
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${-rotationAngle.value}deg) ${extraTranslate}`
  }
}

const getImagePath = (name) => {
  return new URL(`../assets/images/${name}.png`, import.meta.url).href
}

const handleTermClick = (index) => {
  if (index === currentIndex.value) return
  if (isAutoPlaying.value) toggleAutoPlay()
  currentIndex.value = index
}

watch(currentIndex, () => {
  updateParticles()
})

watch(currentIndex, (newIndex) => {
  const targetAngle = -newIndex * 15
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
/* ==================== 全局容器（季节渐变背景） ==================== */
.wheel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Serif SC', serif;
  transition: background 1.5s ease-in-out;
}

.bg-春 { background: linear-gradient(160deg, #e8ded3 0%, #d4c5b5 30%, #c9b8a8 60%, #bfae9e 100%); }
.bg-夏 { background: linear-gradient(160deg, #b8c5b8 0%, #9aab9e 30%, #8d9e8f 60%, #7e907f 100%); }
.bg-秋 { background: linear-gradient(160deg, #d4c4a8 0%, #c4b498 30%, #b8a488 60%, #a89478 100%); }
.bg-冬 { background: linear-gradient(160deg, #c5cdd4 0%, #b3bec8 30%, #a4b0bb 60%, #95a3ae 100%); }

#tsparticles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* ==================== 节气背景图（缩小至1/4页面，位于文字下方） ==================== */
.term-bg-wrap {
  position: fixed;
  bottom: 8vh;
  left: 50%;
  transform: translateX(-50%);
  width: 40vw;
  height: 40vw;
  max-width: 500px;
  max-height: 500px;
  z-index: 5;
  pointer-events: none;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
}

.term-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  transition: opacity 0.6s ease;
}

/* ==================== SVG几何装饰 ==================== */
.deco-svg {
  position: fixed;
  pointer-events: none;
  z-index: 2;
}

.deco-svg-1 {
  top: 8%;
  right: 5%;
  width: 200px;
  height: 200px;
  animation: svgFloat1 16s ease-in-out infinite;
}

.deco-svg-2 {
  top: 15%;
  right: 20%;
  width: 120px;
  height: 60px;
  animation: svgFloat2 14s ease-in-out infinite 2s;
}

.deco-svg-3 {
  bottom: 20%;
  right: 8%;
  width: 70px;
  height: 140px;
  animation: svgFloat1 18s ease-in-out infinite 1s;
}

.deco-svg-4 {
  bottom: 30%;
  right: 25%;
  width: 90px;
  height: 90px;
  animation: svgFloat2 12s ease-in-out infinite 3s;
}

@keyframes svgFloat1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(1deg); }
}

@keyframes svgFloat2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(6px) rotate(-1deg); }
}

/* ==================== 浮动几何装饰 ==================== */
.deco-geo {
  position: fixed;
  pointer-events: none;
  z-index: 2;
  opacity: 0.05;
}

.deco-geo-1 {
  top: 8%;
  right: 5%;
  width: 180px;
  height: 180px;
  border: 1.5px solid #8b7355;
  border-radius: 50% 0 50% 0;
  transform: rotate(15deg);
  animation: geoFloat1 12s ease-in-out infinite;
}

.deco-geo-2 {
  bottom: 15%;
  right: 15%;
  width: 100px;
  height: 100px;
  border: 1px solid #8b7355;
  border-radius: 0 50% 0 50%;
  transform: rotate(-20deg);
  animation: geoFloat2 10s ease-in-out infinite;
}

.deco-geo-3 {
  top: 40%;
  right: 8%;
  width: 60px;
  height: 60px;
  border: 1px solid #8b7355;
  border-radius: 50%;
  opacity: 0.03;
  animation: geoFloat1 14s ease-in-out infinite 2s;
}

.deco-geo-4 {
  top: 20%;
  right: 25%;
  width: 30px;
  height: 30px;
  border: 1px solid #8b7355;
  border-radius: 50% 0 50% 0;
  transform: rotate(45deg);
  opacity: 0.03;
  animation: geoFloat2 8s ease-in-out infinite 1s;
}

.deco-geo-5 {
  bottom: 30%;
  right: 5%;
  width: 50px;
  height: 50px;
  border: 1px solid #8b7355;
  border-radius: 0 50% 0 50%;
  transform: rotate(30deg);
  opacity: 0.03;
  animation: geoFloat1 11s ease-in-out infinite 3s;
}

.deco-geo-6 {
  top: 60%;
  right: 20%;
  width: 24px;
  height: 24px;
  border: 1px solid #8b7355;
  border-radius: 50%;
  opacity: 0.025;
  animation: geoFloat2 9s ease-in-out infinite 0.5s;
}

@keyframes geoFloat1 {
  0%, 100% { transform: rotate(15deg) translateY(0); }
  50% { transform: rotate(15deg) translateY(-6px); }
}

@keyframes geoFloat2 {
  0%, 100% { transform: rotate(-20deg) translateY(0); }
  50% { transform: rotate(-20deg) translateY(5px); }
}

/* ==================== 鼠标跟随光晕 ==================== */
.cursor-glow {
  position: fixed;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
  transition: left 0.4s ease, top 0.4s ease;
}

/* ==================== 顶部导航栏 ==================== */
.top-nav {
  position: fixed;
  top: 8px;
  left: 50%;
  transform: translateX(-50%) scale(1.25);
  width: 80%;
  height: 52px;
  background: rgba(180, 170, 155, 0.1);
  backdrop-filter: blur(24px) saturate(1.3);
  -webkit-backdrop-filter: blur(24px) saturate(1.3);
  border-radius: 26px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  z-index: 100;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transform-origin: center center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-right: 28px;
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.nav-logo:hover {
  opacity: 0.75;
}

.nav-logo-icon {
  width: 22px;
  height: 22px;
  color: rgba(255, 255, 255, 0.8);
}

.logo-text {
  font-size: 17px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 3px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.nav-links {
  display: flex;
  gap: 4px;
  flex: 1;
}

.nav-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 18px;
  font-size: 13px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  letter-spacing: 1px;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.95);
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
  background: transparent;
}

.wheel-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(139, 115, 85, 0.12);
  pointer-events: none;
}

.wheel-ring-outer {
  width: 98%;
  height: 98%;
  left: 1%;
  top: 1%;
}

.wheel-ring-inner {
  width: 60%;
  height: 60%;
  left: 20%;
  top: 20%;
  border-color: rgba(139, 115, 85, 0.08);
}

.wheel-line {
  position: absolute;
  width: 1px;
  height: 50%;
  left: 50%;
  top: 50%;
  margin-left: -0.5px;
  margin-top: -25%;
  background: linear-gradient(to top, rgba(139, 115, 85, 0.15) 0%, rgba(139, 115, 85, 0.03) 100%);
  transform-origin: center center;
}

/* ==================== 图片层 ==================== */
.wheel-image {
  position: absolute;
  width: 16vmin;
  height: 16vmin;
  pointer-events: none;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
  z-index: 15;
  opacity: 0.65;
}

.wheel-image.is-current-image {
  width: 24vmin;
  height: 24vmin;
  z-index: 25;
  opacity: 1;
}

.wheel-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.06));
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
  font-size: 15px;
  color: rgba(100, 90, 75, 0.45);
  white-space: nowrap;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 4px 10px 4px 14px;
  user-select: none;
  font-weight: 400;
  letter-spacing: 2px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.term-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(139, 115, 85, 0.4);
  opacity: 0;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.term-dot.is-visible {
  opacity: 1;
}

.wheel-term:hover {
  color: rgba(100, 90, 75, 0.85);
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transform-origin: center;
}

.wheel-term:hover .term-dot {
  opacity: 1;
}

.wheel-term.is-current {
  font-size: 20px;
  color: rgba(140, 115, 80, 0.9);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px);
  letter-spacing: 3px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
}

.wheel-term.is-current .term-dot {
  width: 6px;
  height: 6px;
  background: rgba(160, 130, 90, 0.6);
  opacity: 1;
}

/* ==================== 中心显示区 ==================== */
.center-display {
  position: fixed;
  top: calc(50% - 200px);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 30;
  pointer-events: none;
  animation: centerFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes centerFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.9);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
    filter: blur(0);
  }
}

.current-season-badge {
  display: inline-block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(139, 115, 85, 0.2);
  backdrop-filter: blur(10px);
  padding: 3px 14px;
  border-radius: 10px;
  letter-spacing: 4px;
  margin-bottom: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.current-name {
  font-size: 56px;
  font-weight: 700;
  color: rgba(80, 70, 55, 0.82);
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
  letter-spacing: 12px;
}

.current-pinyin {
  font-size: 18px;
  color: rgba(139, 115, 85, 0.5);
  margin-top: 8px;
  letter-spacing: 6px;
  font-weight: 300;
}

.current-date {
  font-size: 13px;
  color: rgba(139, 115, 85, 0.4);
  margin-top: 6px;
  letter-spacing: 2px;
}

/* ==================== 节气描述区 ==================== */
.term-description {
  position: fixed;
  top: calc(50% - 120px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  color: rgba(90, 80, 65, 0.6);
  text-align: center;
  z-index: 40;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  animation: descFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 80%;
  white-space: nowrap;
  letter-spacing: 1px;
}

@keyframes descFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(8px);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    filter: blur(0);
  }
}

/* ==================== 控制面板 ==================== */
.control-panel {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 200px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(24px) saturate(1.2);
  -webkit-backdrop-filter: blur(24px) saturate(1.2);
  border-radius: 20px;
  padding: 18px;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(80, 70, 55, 0.7);
  margin-bottom: 14px;
  text-align: center;
  border-bottom: 1px solid rgba(139, 115, 85, 0.12);
  padding-bottom: 10px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.panel-icon-svg {
  width: 16px;
  height: 16px;
  color: rgba(139, 115, 85, 0.5);
}

.panel-section {
  margin-bottom: 10px;
}

.panel-section label {
  display: block;
  font-size: 11px;
  color: rgba(100, 90, 75, 0.55);
  margin-bottom: 5px;
  letter-spacing: 1px;
}

.slider {
  width: 100%;
  accent-color: rgba(139, 115, 85, 0.5);
  height: 3px;
}

.speed-value {
  font-size: 10px;
  color: rgba(139, 115, 85, 0.45);
  margin-left: 4px;
}

.btn-group {
  display: flex;
  gap: 5px;
}

.btn-group button {
  flex: 1;
  padding: 4px 6px;
  border: 1px solid rgba(139, 115, 85, 0.15);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.35);
  color: rgba(100, 90, 75, 0.55);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 1px;
}

.btn-group button:hover {
  background: rgba(255, 255, 255, 0.5);
  color: rgba(80, 70, 55, 0.75);
}

.btn-group button.active {
  background: rgba(139, 115, 85, 0.25);
  color: rgba(80, 70, 55, 0.85);
  border-color: rgba(139, 115, 85, 0.3);
}

.control-btn {
  width: 100%;
  padding: 7px 12px;
  border: 1px solid rgba(139, 115, 85, 0.15);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.35);
  color: rgba(80, 70, 55, 0.7);
  font-size: 12px;
  font-family: 'Noto Serif SC', serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 2px;
}

.control-btn:hover {
  background: rgba(139, 115, 85, 0.18);
  border-color: rgba(139, 115, 85, 0.25);
  transform: translateY(-1px);
}

.control-btn.is-playing {
  background: rgba(160, 130, 90, 0.2);
  color: rgba(80, 70, 55, 0.85);
  border-color: rgba(160, 130, 90, 0.3);
}

.control-btn-reset {
  font-size: 11px;
  padding: 5px 12px;
}
</style>
