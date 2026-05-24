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

    <!-- 三栏内容布局 -->
    <div class="content-layout">
      <!-- 左侧文本框 -->
      <div class="left-panel" :key="'left-' + currentIndex">
        <div class="left-panel-header">
          <svg class="left-panel-icon" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1"/>
            <line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="0.8"/>
            <line x1="8" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="0.8"/>
            <line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" stroke-width="0.8"/>
          </svg>
          <span>节气详解</span>
        </div>
        <div class="left-panel-season">
          <span class="season-indicator" :style="{ background: terms[currentIndex].color }"></span>
          {{ terms[currentIndex].season }}季
        </div>
        <div class="left-panel-date">
          <svg class="left-panel-date-icon" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1"/>
            <line x1="2" y1="8" x2="18" y2="8" stroke="currentColor" stroke-width="0.8"/>
            <line x1="6" y1="2" x2="6" y2="6" stroke="currentColor" stroke-width="1"/>
            <line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" stroke-width="1"/>
          </svg>
          {{ terms[currentIndex].date }}
        </div>
        <div class="left-panel-divider" :style="{ background: terms[currentIndex].color }"></div>
        <div class="left-panel-desc">{{ terms[currentIndex].description }}</div>
        <div class="left-panel-detail">{{ terms[currentIndex].detail }}</div>
        <svg class="left-panel-deco" viewBox="0 0 24 24" fill="none" v-html="terms[currentIndex].decoSvg"></svg>
      </div>

      <!-- 中间主内容区 -->
      <div class="center-column" :key="'center-' + currentIndex">
        <div class="current-season-badge">{{ terms[currentIndex].season }}</div>
        <div class="current-name">{{ terms[currentIndex].name }}</div>
        <div class="current-pinyin">{{ terms[currentIndex].pinyin }}</div>
        <div class="current-date">{{ terms[currentIndex].date }}</div>
        <div class="center-image-wrap">
          <img
            class="center-image"
            :src="getBgPath(terms[currentIndex].name)"
            :alt="terms[currentIndex].name"
          />
        </div>
      </div>

      <!-- 右侧图片区 -->
      <div class="right-panel" :key="'right-' + currentIndex">
        <div class="right-image-frame">
          <img
            class="right-image"
            :src="getImagePath(terms[currentIndex].name)"
            :alt="terms[currentIndex].name"
          />
        </div>
        <div class="right-image-label">{{ terms[currentIndex].name }} · 节气图</div>
      </div>
    </div>

    <!-- 右侧补充面板 -->
    <div class="right-supplementary" :key="'rsup-' + currentIndex">
      <div class="supp-card pentad-card">
        <div class="supp-card-header">
          <svg class="supp-card-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1"/>
            <path d="M12 8 L12 12 L15 14" stroke="currentColor" stroke-width="0.8" fill="none"/>
          </svg>
          <span>节气物候</span>
        </div>
        <div class="pentad-list">
          <div class="pentad-item" v-for="(pentad, idx) in terms[currentIndex].pentads" :key="idx">
            <span class="pentad-index" :style="{ background: terms[currentIndex].color }">{{ idx + 1 }}</span>
            <span class="pentad-text">{{ pentad }}</span>
          </div>
        </div>
      </div>
      <div class="supp-card customs-card">
        <div class="supp-card-header">
          <svg class="supp-card-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 4 Q8 8 8 12 Q8 16 12 20 Q16 16 16 12 Q16 8 12 4Z" stroke="currentColor" stroke-width="1" fill="none"/>
            <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="0.6" fill="none"/>
          </svg>
          <span>节气习俗</span>
        </div>
        <div class="customs-text">{{ terms[currentIndex].customs }}</div>
      </div>
    </div>

    <!-- 底部信息条 -->
    <div class="bottom-bar" :key="'bottom-' + currentIndex">
      <div class="bottom-timeline">
        <div class="timeline-track">
          <div
            v-for="(term, index) in terms"
            :key="'tl-' + term.name"
            class="timeline-node"
            :class="{ 'is-active': index === currentIndex, 'is-same-season': term.season === terms[currentIndex].season }"
            :style="{ '--node-color': term.color }"
            @click="handleTermClick(index)"
          >
            <span class="node-dot"></span>
            <span class="node-label">{{ term.name }}</span>
          </div>
        </div>
      </div>
      <div class="bottom-poetry">
        <svg class="poetry-icon" viewBox="0 0 24 24" fill="none">
          <path d="M6 4 L6 20" stroke="currentColor" stroke-width="0.8"/>
          <path d="M10 4 L10 20" stroke="currentColor" stroke-width="0.8"/>
          <path d="M14 4 L14 20" stroke="currentColor" stroke-width="0.8"/>
          <path d="M18 4 L18 20" stroke="currentColor" stroke-width="0.8"/>
          <path d="M4 8 L20 8" stroke="currentColor" stroke-width="0.6"/>
          <path d="M4 14 L20 14" stroke="currentColor" stroke-width="0.6"/>
        </svg>
        <span class="poetry-text">{{ terms[currentIndex].poetry }}</span>
      </div>
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
        <label>粒子数量</label>
        <input type="range" min="0" max="150" v-model="particleCount" class="slider" />
        <span class="speed-value">{{ particleCount }}</span>
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
const particleCount = ref(50)

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
  '冬': ['#c8d0d8', '#b8c4d0', '#d0d8e0', '#bcc8d4'],
  'swallow': ['#5a4a3a', '#6b5a48', '#4a3e32', '#7a6a58'],
  'ice': ['#a8c8e0', '#c0d8f0', '#90b8d8', '#d0e8f8']
}

class Particle {
  constructor(x, y, color, season, particleType) {
    this.x = x
    this.y = y
    this.color = color
    this.season = season
    this.particleType = particleType || season
    this.size = Math.random() * 8 + 4
    this.speedX = (Math.random() - 0.5) * 2
    this.speedY = Math.random() * 3 + 1
    this.opacity = Math.random() * 0.35 + 0.15
    this.wobble = Math.random() * Math.PI * 2
    this.wobbleSpeed = Math.random() * 0.05 + 0.02
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 2
    this.wingPhase = Math.random() * Math.PI * 2
    this.wingSpeed = Math.random() * 0.08 + 0.04
    this.glitter = Math.random() * Math.PI * 2
    this.glitterSpeed = Math.random() * 0.06 + 0.03

    if (particleType === 'swallow') {
      this.size = Math.random() * 6 + 5
      this.speedX = (Math.random() - 0.3) * 3 + 1
      this.speedY = (Math.random() - 0.5) * 1.5
      this.opacity = Math.random() * 0.2 + 0.35
      this.wobbleSpeed = Math.random() * 0.03 + 0.02
    } else if (particleType === 'ice') {
      this.size = Math.random() * 10 + 6
      this.speedX = (Math.random() - 0.5) * 0.8
      this.speedY = Math.random() * 1.5 + 0.5
      this.opacity = Math.random() * 0.15 + 0.25
      this.rotationSpeed = (Math.random() - 0.5) * 1.5
    }
  }

  update() {
    this.wobble += this.wobbleSpeed
    this.rotation += this.rotationSpeed
    this.wingPhase += this.wingSpeed
    this.glitter += this.glitterSpeed

    if (this.particleType === 'swallow') {
      this.x += this.speedX + Math.sin(this.wobble) * 0.8
      this.y += this.speedY + Math.cos(this.wobble * 0.5) * 0.3
      if (this.x > window.innerWidth + 50) {
        this.x = -50
        this.y = Math.random() * window.innerHeight * 0.6
      }
      if (this.y < -50) this.y = window.innerHeight + 50
      if (this.y > window.innerHeight + 50) this.y = -50
    } else if (this.particleType === 'ice') {
      this.x += this.speedX + Math.sin(this.wobble) * 0.3
      this.y += this.speedY
      if (this.y > window.innerHeight + 30) {
        this.y = -30
        this.x = Math.random() * window.innerWidth
        this.rotation = Math.random() * 360
      }
      if (this.x < -30) this.x = window.innerWidth + 30
      if (this.x > window.innerWidth + 30) this.x = -30
    } else {
      this.x += this.speedX + Math.sin(this.wobble) * 0.5
      this.y += this.speedY
      if (this.y > window.innerHeight) {
        this.y = -10
        this.x = Math.random() * window.innerWidth
      }
      if (this.x < 0) this.x = window.innerWidth
      if (this.x > window.innerWidth) this.x = 0
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.translate(this.x, this.y)

    if (this.particleType === 'swallow') {
      this.drawSwallow(ctx)
    } else if (this.particleType === 'ice') {
      this.drawIce(ctx)
    } else if (this.season === '春') {
      ctx.rotate((this.rotation * Math.PI) / 180)
      this.drawPetal(ctx)
    } else if (this.season === '秋') {
      ctx.rotate((this.rotation * Math.PI) / 180)
      this.drawLeaf(ctx)
    } else if (this.season === '冬') {
      ctx.rotate((this.rotation * Math.PI) / 180)
      this.drawSnowflake(ctx)
    } else {
      ctx.rotate((this.rotation * Math.PI) / 180)
      ctx.beginPath()
      ctx.arc(0, 0, this.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  drawSwallow(ctx) {
    const s = this.size
    const wingAngle = Math.sin(this.wingPhase) * 0.6

    ctx.fillStyle = this.color
    ctx.globalAlpha = this.opacity

    // 燕子身体
    ctx.beginPath()
    ctx.ellipse(0, 0, s * 0.35, s * 0.15, 0, 0, Math.PI * 2)
    ctx.fill()

    // 左翼
    ctx.beginPath()
    ctx.moveTo(-s * 0.2, 0)
    ctx.quadraticCurveTo(-s * 1.2, -s * 0.8 + wingAngle * s, -s * 1.8, -s * 0.3 + wingAngle * s * 1.5)
    ctx.quadraticCurveTo(-s * 1.2, s * 0.1 + wingAngle * s * 0.5, -s * 0.2, s * 0.05)
    ctx.closePath()
    ctx.fill()

    // 右翼
    ctx.beginPath()
    ctx.moveTo(s * 0.2, 0)
    ctx.quadraticCurveTo(s * 1.2, -s * 0.8 + wingAngle * s, s * 1.8, -s * 0.3 + wingAngle * s * 1.5)
    ctx.quadraticCurveTo(s * 1.2, s * 0.1 + wingAngle * s * 0.5, s * 0.2, s * 0.05)
    ctx.closePath()
    ctx.fill()

    // 尾羽
    ctx.beginPath()
    ctx.moveTo(-s * 0.3, 0)
    ctx.lineTo(-s * 0.8, s * 0.4)
    ctx.lineTo(-s * 0.5, s * 0.15)
    ctx.lineTo(-s * 0.3, s * 0.1)
    ctx.closePath()
    ctx.fill()

    // 头部
    ctx.beginPath()
    ctx.arc(s * 0.35, -s * 0.05, s * 0.12, 0, Math.PI * 2)
    ctx.fill()
  }

  drawIce(ctx) {
    const s = this.size
    const glitterAlpha = (Math.sin(this.glitter) + 1) * 0.5

    ctx.save()
    ctx.rotate((this.rotation * Math.PI) / 180)

    // 冰块主体 - 六边形
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.opacity * 0.6
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3
      const r = s * (i % 2 === 0 ? 1 : 0.7)
      const px = Math.cos(angle) * r
      const py = Math.sin(angle) * r
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()

    // 冰块高光边缘
    ctx.strokeStyle = '#e0f0ff'
    ctx.lineWidth = 1.2
    ctx.globalAlpha = this.opacity * 0.8
    ctx.stroke()

    // 内部折射线
    ctx.strokeStyle = '#c0e0f8'
    ctx.lineWidth = 0.6
    ctx.globalAlpha = this.opacity * 0.4
    ctx.beginPath()
    ctx.moveTo(-s * 0.3, -s * 0.3)
    ctx.lineTo(s * 0.2, s * 0.4)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(s * 0.1, -s * 0.5)
    ctx.lineTo(-s * 0.2, s * 0.3)
    ctx.stroke()

    // 闪烁光点
    ctx.fillStyle = '#ffffff'
    ctx.globalAlpha = this.opacity * glitterAlpha * 0.9
    ctx.beginPath()
    ctx.arc(s * 0.25, -s * 0.25, s * 0.15, 0, Math.PI * 2)
    ctx.fill()

    // 外发光
    ctx.shadowColor = this.color
    ctx.shadowBlur = s * 0.8
    ctx.globalAlpha = this.opacity * 0.2
    ctx.beginPath()
    ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2)
    ctx.fill()

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
  const currentTerm = terms[currentIndex.value]
  const season = currentTerm.season
  const particleType = currentTerm.particleType || season
  const colors = particleColors[particleType] || particleColors[season] || particleColors['春']
  particles = []
  const count = particleCount.value
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvasEl.width
    const y = Math.random() * canvasEl.height
    const color = colors[Math.floor(Math.random() * colors.length)]
    particles.push(new Particle(x, y, color, season, particleType))
  }
  animateParticles()
}

function syncParticleCount() {
  if (!canvasEl) return
  const target = particleCount.value
  const currentTerm = terms[currentIndex.value]
  const season = currentTerm.season
  const particleType = currentTerm.particleType || season
  const colors = particleColors[particleType] || particleColors[season] || particleColors['春']
  while (particles.length < target) {
    const x = Math.random() * canvasEl.width
    const y = Math.random() * canvasEl.height
    const color = colors[Math.floor(Math.random() * colors.length)]
    particles.push(new Particle(x, y, color, season, particleType))
  }
  while (particles.length > target) {
    particles.pop()
  }
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
  const currentTerm = terms[currentIndex.value]
  const season = currentTerm.season
  const particleType = currentTerm.particleType || season
  const colors = particleColors[particleType] || particleColors[season] || particleColors['春']
  particles.forEach(particle => {
    particle.color = colors[Math.floor(Math.random() * colors.length)]
    particle.season = season
    particle.particleType = particleType
    if (particleType === 'swallow') {
      particle.speedY = (Math.random() - 0.5) * 1.5
      particle.size = Math.random() * 6 + 5
      particle.opacity = Math.random() * 0.2 + 0.35
    } else if (particleType === 'ice') {
      particle.speedY = Math.random() * 1.5 + 0.5
      particle.size = Math.random() * 10 + 6
      particle.opacity = Math.random() * 0.15 + 0.25
    } else {
      particle.speedY = season === '秋' ? 3 : (season === '冬' ? 1.5 : 2)
      particle.size = season === '秋' ? (Math.random() * 4 + 3) : (Math.random() * 4 + 2)
    }
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

watch(particleCount, () => {
  syncParticleCount()
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
/* ==================== 全局容器（动态渐变背景） ==================== */
.wheel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Serif SC', serif;
  transition: background 1.5s ease-in-out;
  background-size: 300% 300%;
  animation: bgShift 12s ease-in-out infinite;
}

@keyframes bgShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 0%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 100%; }
  100% { background-position: 0% 50%; }
}

.bg-春 { background: linear-gradient(160deg, #e8ded3 0%, #d4c5b5 25%, #c9b8a8 50%, #bfae9e 75%, #e0d5ca 100%); }
.bg-夏 { background: linear-gradient(160deg, #b8c5b8 0%, #9aab9e 25%, #8d9e8f 50%, #7e907f 75%, #a8b8a8 100%); }
.bg-秋 { background: linear-gradient(160deg, #d4c4a8 0%, #c4b498 25%, #b8a488 50%, #a89478 75%, #ccbc9c 100%); }
.bg-冬 { background: linear-gradient(160deg, #c5cdd4 0%, #b3bec8 25%, #a4b0bb 50%, #95a3ae 75%, #b8c4ce 100%); }

#tsparticles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
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
  width: 54%;
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
  width: 110vmin;
  height: 110vmin;
  left: calc(-42% + 20px);
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  opacity: 0.7;
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
  z-index: 8;
  opacity: 0.55;
}

.wheel-image.is-current-image {
  width: 24vmin;
  height: 24vmin;
  z-index: 12;
  opacity: 0.85;
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
  z-index: 10;
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
  color: rgba(100, 90, 75, 0.9);
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
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

/* ==================== 三栏内容布局 ==================== */
.content-layout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 44px;
  z-index: 30;
  pointer-events: none;
  padding: 90px 80px 60px;
  box-sizing: border-box;
}

/* ==================== 左侧文本框 ==================== */
.left-panel {
  width: 260px;
  flex-shrink: 0;
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border-radius: 20px;
  padding: 24px 22px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  animation: leftSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition: background 0.6s ease, border-color 0.6s ease;
}

@keyframes leftSlideIn {
  from {
    opacity: 0;
    transform: translateX(-24px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0);
  }
}

.left-panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
}

.left-panel-icon {
  width: 18px;
  height: 18px;
  color: rgba(139, 115, 85, 0.5);
}

.left-panel-header span {
  font-size: 14px;
  font-weight: 600;
  color: rgba(80, 70, 55, 0.7);
  letter-spacing: 3px;
}

.left-panel-season {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: rgba(80, 70, 55, 0.75);
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.season-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background 0.6s ease;
}

.left-panel-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(139, 115, 85, 0.5);
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.left-panel-date-icon {
  width: 14px;
  height: 14px;
  color: rgba(139, 115, 85, 0.4);
}

.left-panel-divider {
  height: 2px;
  border-radius: 1px;
  margin-bottom: 16px;
  opacity: 0.5;
  transition: background 0.6s ease;
}

.left-panel-desc {
  font-size: 16px;
  color: rgba(80, 70, 55, 0.8);
  font-weight: 600;
  letter-spacing: 2px;
  line-height: 1.8;
  margin-bottom: 12px;
}

.left-panel-detail {
  font-size: 13px;
  color: rgba(100, 90, 75, 0.6);
  line-height: 2;
  letter-spacing: 0.5px;
}

.left-panel-deco {
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 56px;
  height: 56px;
  color: rgba(139, 115, 85, 0.08);
  opacity: 0.6;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.left-panel:hover .left-panel-deco {
  opacity: 1;
  transform: scale(1.1) rotate(5deg);
}

/* ==================== 中间主内容区 ==================== */
.center-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  pointer-events: none;
  animation: centerFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes centerFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

.current-season-badge {
  display: inline-block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(139, 115, 85, 0.22);
  backdrop-filter: blur(12px);
  padding: 4px 18px;
  border-radius: 12px;
  letter-spacing: 5px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: background 0.6s ease;
}

.current-name {
  font-size: 64px;
  font-weight: 700;
  color: rgba(80, 70, 55, 0.85);
  text-shadow: 0 3px 20px rgba(0, 0, 0, 0.06);
  letter-spacing: 14px;
  transition: color 0.6s ease, letter-spacing 0.4s ease;
  line-height: 1.2;
}

.current-pinyin {
  font-size: 20px;
  color: rgba(139, 115, 85, 0.5);
  margin-top: 10px;
  letter-spacing: 8px;
  font-weight: 300;
  transition: color 0.6s ease;
}

.current-date {
  font-size: 14px;
  color: rgba(139, 115, 85, 0.4);
  margin-top: 8px;
  letter-spacing: 3px;
  transition: color 0.6s ease;
}

.center-image-wrap {
  width: 300px;
  aspect-ratio: 16 / 9;
  margin-top: 24px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.4s ease;
}

.center-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

/* ==================== 右侧图片区 ==================== */
.right-panel {
  width: 280px;
  flex-shrink: 0;
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  animation: rightSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
  transition: background 0.6s ease, border-color 0.6s ease;
}

@keyframes rightSlideIn {
  from {
    opacity: 0;
    transform: translateX(24px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0);
  }
}

.right-image-frame {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
}

.right-panel:hover .right-image-frame {
  transform: scale(1.02);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.right-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.right-image-label {
  text-align: center;
  margin-top: 14px;
  font-size: 13px;
  color: rgba(100, 90, 75, 0.55);
  letter-spacing: 3px;
  font-weight: 400;
}

/* ==================== 控制面板 ==================== */
.control-panel {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 190px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(24px) saturate(1.2);
  -webkit-backdrop-filter: blur(24px) saturate(1.2);
  border-radius: 18px;
  padding: 16px;
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

/* ==================== 右侧补充面板 ==================== */
.right-supplementary {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 35;
  pointer-events: auto;
  animation: rightSuppIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes rightSuppIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(20px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
    filter: blur(0);
  }
}

.supp-card {
  background: rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border-radius: 18px;
  padding: 18px 16px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  transition: background 0.6s ease, border-color 0.6s ease, transform 0.3s ease;
}

.supp-card:hover {
  background: rgba(255, 255, 255, 0.42);
  transform: translateY(-2px);
}

.supp-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
}

.supp-card-icon {
  width: 16px;
  height: 16px;
  color: rgba(139, 115, 85, 0.5);
}

.supp-card-header span {
  font-size: 13px;
  font-weight: 600;
  color: rgba(80, 70, 55, 0.7);
  letter-spacing: 2px;
}

.pentad-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pentad-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pentad-index {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  flex-shrink: 0;
  transition: background 0.6s ease;
}

.pentad-text {
  font-size: 13px;
  color: rgba(80, 70, 55, 0.7);
  letter-spacing: 1px;
  line-height: 1.5;
}

.customs-text {
  font-size: 13px;
  color: rgba(80, 70, 55, 0.65);
  line-height: 1.8;
  letter-spacing: 1px;
}

/* ==================== 底部信息条 ==================== */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 35;
  pointer-events: none;
  animation: bottomBarIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

@keyframes bottomBarIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bottom-timeline {
  padding: 0 80px;
  margin-bottom: 8px;
}

.timeline-track {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px) saturate(1.1);
  -webkit-backdrop-filter: blur(16px) saturate(1.1);
  border-radius: 24px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  overflow-x: auto;
  pointer-events: auto;
}

.timeline-track::-webkit-scrollbar {
  display: none;
}

.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  min-width: 40px;
}

.timeline-node:hover {
  background: rgba(255, 255, 255, 0.25);
}

.node-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(139, 115, 85, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-node.is-same-season .node-dot {
  background: rgba(139, 115, 85, 0.35);
}

.timeline-node.is-active .node-dot {
  width: 10px;
  height: 10px;
  background: var(--node-color);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.node-label {
  font-size: 10px;
  color: rgba(100, 90, 75, 0.35);
  letter-spacing: 1px;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.timeline-node.is-same-season .node-label {
  color: rgba(100, 90, 75, 0.5);
}

.timeline-node.is-active .node-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(80, 70, 55, 0.85);
  letter-spacing: 2px;
}

.bottom-poetry {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 80px 16px;
  pointer-events: none;
}

.poetry-icon {
  width: 18px;
  height: 18px;
  color: rgba(139, 115, 85, 0.3);
  flex-shrink: 0;
}

.poetry-text {
  font-size: 13px;
  color: rgba(100, 90, 75, 0.5);
  letter-spacing: 2px;
  font-style: italic;
  line-height: 1.6;
  text-align: center;
  transition: opacity 0.5s ease;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 1440px) {
  .right-supplementary {
    width: 180px;
    right: 16px;
  }

  .bottom-timeline,
  .bottom-poetry {
    padding-left: 40px;
    padding-right: 40px;
  }
}

@media (max-width: 1200px) {
  .right-supplementary {
    display: none;
  }

  .bottom-timeline,
  .bottom-poetry {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (max-width: 900px) {
  .bottom-bar {
    display: none;
  }
}
</style>
