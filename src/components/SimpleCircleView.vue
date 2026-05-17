<template>
  <div class="circle-page" @mousemove="handleMouseMove">
    <!-- SVG几何装饰 -->
    <svg class="deco-svg deco-svg-1" viewBox="0 0 200 200" fill="none">
      <path d="M20 180 Q60 100 100 140 Q140 80 180 120" stroke="rgba(139,115,85,0.07)" stroke-width="1.5" fill="none"/>
      <path d="M10 190 Q50 130 90 160 Q130 110 170 140" stroke="rgba(139,115,85,0.04)" stroke-width="1" fill="none"/>
    </svg>
    <svg class="deco-svg deco-svg-2" viewBox="0 0 120 60" fill="none">
      <path d="M10 50 Q30 10 60 30 Q90 10 110 50" stroke="rgba(139,115,85,0.05)" stroke-width="1.2" fill="none"/>
      <circle cx="60" cy="20" r="8" stroke="rgba(139,115,85,0.04)" stroke-width="0.8" fill="none"/>
    </svg>
    <svg class="deco-svg deco-svg-3" viewBox="0 0 80 160" fill="none">
      <path d="M40 10 L40 150" stroke="rgba(139,115,85,0.04)" stroke-width="1"/>
      <path d="M40 40 Q20 30 15 45" stroke="rgba(139,115,85,0.05)" stroke-width="0.8" fill="none"/>
      <path d="M40 70 Q60 60 65 75" stroke="rgba(139,115,85,0.05)" stroke-width="0.8" fill="none"/>
    </svg>

    <!-- 浮动几何装饰 -->
    <div class="geo-float geo-float-1"></div>
    <div class="geo-float geo-float-2"></div>
    <div class="geo-float geo-float-3"></div>

    <!-- 鼠标跟随光晕 -->
    <div class="cursor-glow" :style="cursorGlowStyle"></div>

    <!-- 顶部导航栏 -->
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
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'home')">首页</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'terms')">节气介绍</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'culture')">传统文化</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'poetry')">诗词歌赋</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'farming')">农事指南</a>
      </div>
    </nav>

    <div class="circle-content">
      <!-- 多层旋转圆环 -->
      <div class="circle-group">
        <!-- 外层光晕 -->
        <div class="ring-glow"></div>
        <div class="ring ring-outer"></div>
        <div class="ring ring-middle"></div>
        <div class="ring ring-inner"></div>
        <div class="ring ring-core"></div>
        <!-- 中心文字 -->
        <div class="center-text">
          <span class="center-char">气</span>
        </div>
        <!-- 旋转的节气标记 -->
        <div class="orbit-markers">
          <div
            v-for="(term, idx) in orbitTerms"
            :key="idx"
            class="orbit-marker"
            :style="{ transform: `rotate(${idx * 30}deg) translateY(-140px)` }"
          >
            <span class="marker-text" :style="{ transform: `rotate(${-(idx * 30)}deg)` }">{{ term }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧说明 -->
      <div class="side-info">
        <div class="info-badge">旋转圆</div>
        <h2 class="info-title">节气之轮</h2>
        <div class="info-line">
          <div class="info-line-fill"></div>
        </div>
        <p class="info-desc">十二节气环绕旋转，<br>象征四季轮回、生生不息</p>
        <div class="info-controls">
          <button class="ctrl-btn" @click="togglePause">
            {{ isPaused ? '▶ 继续' : '⏸ 暂停' }}
          </button>
          <button class="ctrl-btn" @click="toggleDirection">
            {{ isReversed ? '↺ 正转' : '↻ 反转' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
defineEmits(['navigate'])

const isPaused = ref(false)
const isReversed = ref(false)

const mousePos = reactive({ x: 0.5, y: 0.5 })

const handleMouseMove = (e) => {
  mousePos.x = e.clientX / window.innerWidth
  mousePos.y = e.clientY / window.innerHeight
}

const cursorGlowStyle = computed(() => ({
  left: `${mousePos.x * 100}%`,
  top: `${mousePos.y * 100}%`
}))

const orbitTerms = [
  '立春', '惊蛰', '清明', '立夏', '芒种', '小暑',
  '立秋', '白露', '寒露', '立冬', '大雪', '小寒'
]

const togglePause = () => {
  isPaused.value = !isPaused.value
  document.documentElement.style.setProperty('--circle-play-state', isPaused.value ? 'paused' : 'running')
}

const toggleDirection = () => {
  isReversed.value = !isReversed.value
  document.documentElement.style.setProperty('--circle-direction', isReversed.value ? 'reverse' : 'normal')
}
</script>

<style scoped>
.circle-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(160deg, #ddd5cc 0%, #cec4b8 30%, #bfb3a5 60%, #b0a495 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Noto Serif SC', serif;
  overflow: hidden;
}

/* ==================== SVG几何装饰 ==================== */
.deco-svg {
  position: fixed;
  pointer-events: none;
  z-index: 0;
}

.deco-svg-1 {
  top: 8%;
  right: 6%;
  width: 180px;
  height: 180px;
  animation: svgFloat1 16s ease-in-out infinite;
}

.deco-svg-2 {
  bottom: 12%;
  left: 5%;
  width: 120px;
  height: 60px;
  animation: svgFloat2 14s ease-in-out infinite 2s;
}

.deco-svg-3 {
  top: 50%;
  right: 3%;
  width: 70px;
  height: 140px;
  animation: svgFloat1 18s ease-in-out infinite 1s;
}

@keyframes svgFloat1 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes svgFloat2 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* ==================== 浮动几何装饰 ==================== */
.geo-float {
  position: fixed;
  pointer-events: none;
  z-index: 0;
}

.geo-float-1 {
  top: 15%;
  right: 18%;
  width: 50px;
  height: 50px;
  border: 1px solid rgba(139, 115, 85, 0.06);
  border-radius: 50%;
  animation: geoSpin 20s linear infinite;
}

.geo-float-2 {
  bottom: 20%;
  left: 8%;
  width: 35px;
  height: 35px;
  border: 1px solid rgba(139, 115, 85, 0.05);
  border-radius: 50% 0 50% 0;
  transform: rotate(30deg);
  animation: geoSpin 16s linear infinite reverse;
}

.geo-float-3 {
  top: 55%;
  right: 5%;
  width: 20px;
  height: 20px;
  border: 1px solid rgba(139, 115, 85, 0.04);
  border-radius: 0 50% 0 50%;
  animation: geoSpin 12s linear infinite;
}

@keyframes geoSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  z-index: 1;
  transition: left 0.4s ease, top 0.4s ease;
}

/* ==================== 顶部导航栏 ==================== */
.top-nav {
  position: fixed;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 52px;
  background: rgba(180, 170, 155, 0.12);
  backdrop-filter: blur(24px) saturate(1.3);
  -webkit-backdrop-filter: blur(24px) saturate(1.3);
  border-radius: 26px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  z-index: 100;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.15);
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
  opacity: 0.7;
}

.nav-logo-icon {
  width: 22px;
  height: 22px;
  color: rgba(100, 90, 75, 0.65);
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: rgba(80, 70, 55, 0.85);
  letter-spacing: 3px;
}

.nav-links {
  display: flex;
  gap: 4px;
  flex: 1;
}

.nav-link {
  color: rgba(80, 70, 55, 0.5);
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 18px;
  font-size: 13px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  letter-spacing: 1px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(80, 70, 55, 0.85);
  transform: translateY(-1px);
}

/* ==================== 内容区 ==================== */
.circle-content {
  display: flex;
  align-items: center;
  gap: 80px;
  z-index: 1;
  animation: contentIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes contentIn {
  from { opacity: 0; transform: scale(0.95); filter: blur(4px); }
  to { opacity: 1; transform: scale(1); filter: blur(0); }
}

/* ==================== 圆环组 ==================== */
.circle-group {
  position: relative;
  width: 320px;
  height: 320px;
}

/* 外层光晕 */
.ring-glow {
  position: absolute;
  width: 340px;
  height: 340px;
  top: -10px;
  left: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139,115,85,0.06) 0%, transparent 70%);
  animation: glowPulse 4s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.03); }
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(139, 115, 85, 0.12);
}

.ring-outer {
  width: 320px;
  height: 320px;
  top: 0;
  left: 0;
  border-width: 1.5px;
  border-color: rgba(139, 115, 85, 0.18);
  animation: spin 30s linear infinite var(--circle-direction, normal) var(--circle-play-state, running);
}

.ring-middle {
  width: 260px;
  height: 260px;
  top: 30px;
  left: 30px;
  border-style: dashed;
  border-color: rgba(139, 115, 85, 0.1);
  animation: spin 24s linear infinite reverse var(--circle-play-state, running);
}

.ring-inner {
  width: 200px;
  height: 200px;
  top: 60px;
  left: 60px;
  border-color: rgba(139, 115, 85, 0.08);
  animation: spin 18s linear infinite var(--circle-direction, normal) var(--circle-play-state, running);
}

.ring-core {
  width: 100px;
  height: 100px;
  top: 110px;
  left: 110px;
  border-width: 1.5px;
  border-color: rgba(139, 115, 85, 0.15);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  animation: spin 12s linear infinite reverse var(--circle-play-state, running);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.center-char {
  font-size: 34px;
  color: rgba(139, 115, 85, 0.3);
  font-weight: 700;
  letter-spacing: 4px;
}

/* 旋转的节气标记 */
.orbit-markers {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  animation: spin 30s linear infinite var(--circle-direction, normal) var(--circle-play-state, running);
}

.orbit-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
}

.marker-text {
  position: absolute;
  font-size: 12px;
  color: rgba(139, 115, 85, 0.4);
  letter-spacing: 2px;
  white-space: nowrap;
  transform-origin: center;
  transition: color 0.3s ease;
}

/* ==================== 右侧说明 ==================== */
.side-info {
  max-width: 280px;
  animation: sideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes sideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.info-badge {
  display: inline-block;
  font-size: 11px;
  color: rgba(139, 115, 85, 0.55);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 4px 16px;
  border-radius: 12px;
  letter-spacing: 3px;
  margin-bottom: 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.info-title {
  font-size: 32px;
  color: rgba(80, 70, 55, 0.82);
  margin: 0 0 14px;
  letter-spacing: 6px;
  font-weight: 700;
}

.info-line {
  width: 40px;
  height: 2px;
  background: rgba(139, 115, 85, 0.1);
  margin-bottom: 18px;
  border-radius: 1px;
  overflow: hidden;
}

.info-line-fill {
  width: 100%;
  height: 100%;
  background: rgba(139, 115, 85, 0.25);
  transform: scaleX(0);
  transform-origin: left;
  animation: lineGrow 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
}

@keyframes lineGrow {
  to { transform: scaleX(1); }
}

.info-desc {
  font-size: 14px;
  color: rgba(100, 90, 75, 0.5);
  line-height: 1.9;
  letter-spacing: 2px;
  margin: 0 0 28px;
}

.info-controls {
  display: flex;
  gap: 10px;
}

.ctrl-btn {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  color: rgba(80, 70, 55, 0.65);
  font-size: 13px;
  font-family: 'Noto Serif SC', serif;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.ctrl-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.25);
}

.ctrl-btn:active {
  transform: translateY(0);
  transition-duration: 0.1s;
}

@media (max-width: 768px) {
  .circle-content {
    flex-direction: column;
    gap: 40px;
  }
  .circle-group {
    width: 260px;
    height: 260px;
  }
  .ring-outer { width: 260px; height: 260px; }
  .ring-middle { width: 210px; height: 210px; top: 25px; left: 25px; }
  .ring-inner { width: 160px; height: 160px; top: 50px; left: 50px; }
  .ring-core { width: 80px; height: 80px; top: 90px; left: 90px; }
  .ring-glow { width: 280px; height: 280px; top: -10px; left: -10px; }
}
</style>
