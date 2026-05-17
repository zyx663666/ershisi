<template>
  <div class="home-page" @mousemove="handleMouseMove">
    <!-- 动态渐变背景层 -->
    <div class="bg-gradient" :style="bgGradientStyle"></div>

    <!-- SVG几何装饰层（极简线稿：山水、祥云、竹叶、荷花的抽象形态） -->
    <svg class="deco-svg deco-svg-1" viewBox="0 0 200 200" fill="none">
      <path d="M20 180 Q60 100 100 140 Q140 80 180 120" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" fill="none"/>
      <path d="M10 190 Q50 130 90 160 Q130 110 170 140 Q190 120 200 130" stroke="rgba(255,255,255,0.04)" stroke-width="1" fill="none"/>
    </svg>
    <svg class="deco-svg deco-svg-2" viewBox="0 0 120 60" fill="none">
      <path d="M10 50 Q30 10 60 30 Q90 10 110 50" stroke="rgba(255,255,255,0.05)" stroke-width="1.2" fill="none"/>
      <circle cx="60" cy="20" r="8" stroke="rgba(255,255,255,0.04)" stroke-width="0.8" fill="none"/>
    </svg>
    <svg class="deco-svg deco-svg-3" viewBox="0 0 80 160" fill="none">
      <path d="M40 10 L40 150" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      <path d="M40 40 Q20 30 15 45" stroke="rgba(255,255,255,0.05)" stroke-width="0.8" fill="none"/>
      <path d="M40 70 Q60 60 65 75" stroke="rgba(255,255,255,0.05)" stroke-width="0.8" fill="none"/>
      <path d="M40 100 Q25 90 20 105" stroke="rgba(255,255,255,0.04)" stroke-width="0.8" fill="none"/>
    </svg>
    <svg class="deco-svg deco-svg-4" viewBox="0 0 100 100" fill="none">
      <path d="M50 10 Q70 30 50 50 Q30 30 50 10" stroke="rgba(255,255,255,0.05)" stroke-width="1" fill="none"/>
      <path d="M50 50 Q70 70 50 90 Q30 70 50 50" stroke="rgba(255,255,255,0.04)" stroke-width="1" fill="none"/>
      <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.03)" stroke-width="0.6"/>
    </svg>
    <svg class="deco-svg deco-svg-5" viewBox="0 0 160 80" fill="none">
      <path d="M10 70 Q40 20 80 40 Q120 10 150 60" stroke="rgba(255,255,255,0.04)" stroke-width="1" fill="none"/>
      <path d="M30 70 Q60 30 90 50 Q110 25 140 65" stroke="rgba(255,255,255,0.03)" stroke-width="0.8" fill="none"/>
    </svg>

    <!-- 浮动几何装饰 -->
    <div class="geo-float geo-float-1"></div>
    <div class="geo-float geo-float-2"></div>
    <div class="geo-float geo-float-3"></div>
    <div class="geo-float geo-float-4"></div>
    <div class="geo-float geo-float-5"></div>
    <div class="geo-float geo-float-6"></div>

    <!-- 鼠标跟随光晕 -->
    <div class="cursor-glow" :style="cursorGlowStyle"></div>

    <div class="home-header">
      <div class="header-badge">中国传统文化遗产</div>
      <h1 class="home-title">
        <span v-for="(char, i) in titleChars" :key="i" class="title-char" :style="{ animationDelay: i * 0.1 + 's' }">{{ char }}</span>
      </h1>
      <div class="title-line">
        <div class="line-fill"></div>
      </div>
      <p class="home-subtitle">探索千年节气智慧 · 感受四季流转之美</p>
    </div>

    <div class="button-grid">
      <button
        v-for="(btn, idx) in navButtons"
        :key="btn.page"
        class="nav-button"
        :style="{ animationDelay: 0.4 + idx * 0.08 + 's' }"
        @click="navigateTo(btn.page)"
        @mouseenter="activeBtn = idx"
        @mouseleave="activeBtn = -1"
      >
        <div class="btn-glow" :class="{ 'is-active': activeBtn === idx }"></div>
        <div class="btn-icon-wrap" :style="{ background: btn.iconBg }">
          <svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" v-html="btn.svgPath"></svg>
        </div>
        <span class="button-text">{{ btn.text }}</span>
        <span class="button-desc">{{ btn.desc }}</span>
        <div class="btn-arrow" :class="{ 'is-visible': activeBtn === idx }">→</div>
      </button>
    </div>

    <div class="home-footer">
      <span class="footer-char" v-for="(char, i) in footerChars" :key="i" :style="{ animationDelay: 1.5 + i * 0.05 + 's' }">{{ char }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const emit = defineEmits(['navigate'])

const navigateTo = (page) => {
  emit('navigate', page)
}

const titleChars = ['二', '十', '四', '节', '气']
const footerChars = '春雨惊春清谷天 · 夏满芒夏暑相连'.split('')

const activeBtn = ref(-1)

const mousePos = reactive({ x: 0.5, y: 0.5 })

const handleMouseMove = (e) => {
  mousePos.x = e.clientX / window.innerWidth
  mousePos.y = e.clientY / window.innerHeight
}

const bgGradientStyle = computed(() => ({
  background: `radial-gradient(ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(210,195,178,0.3) 0%, transparent 50%)`
}))

const cursorGlowStyle = computed(() => ({
  left: `${mousePos.x * 100}%`,
  top: `${mousePos.y * 100}%`
}))

const navButtons = [
  {
    page: 'wheel',
    text: '节气轮盘',
    desc: '24节气圆形展示',
    iconBg: 'linear-gradient(135deg, rgba(180,155,130,0.3), rgba(160,135,110,0.2))',
    svgPath: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="0.8"/><line x1="12" y1="3" x2="12" y2="7" stroke="currentColor" stroke-width="0.8"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="0.8"/><line x1="3" y1="12" x2="7" y2="12" stroke="currentColor" stroke-width="0.8"/><line x1="17" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="0.8"/>'
  },
  {
    page: 'circle',
    text: '旋转圆',
    desc: '简约旋转动画',
    iconBg: 'linear-gradient(135deg, rgba(150,170,160,0.3), rgba(130,155,145,0.2))',
    svgPath: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/><circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="0.8"/><circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.4"/>'
  },
  {
    page: 'terms',
    text: '节气介绍',
    desc: '详细节气知识',
    iconBg: 'linear-gradient(135deg, rgba(190,170,145,0.3), rgba(175,155,130,0.2))',
    svgPath: '<rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.2"/><line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="0.8"/><line x1="8" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="0.8"/><line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" stroke-width="0.8"/>'
  },
  {
    page: 'culture',
    text: '传统文化',
    desc: '节气相关习俗',
    iconBg: 'linear-gradient(135deg, rgba(160,145,170,0.3), rgba(145,130,155,0.2))',
    svgPath: '<path d="M12 3L20 8V16L12 21L4 16V8L12 3Z" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M12 8L16 10.5V15.5L12 18L8 15.5V10.5L12 8Z" stroke="currentColor" stroke-width="0.8" fill="none"/>'
  },
  {
    page: 'poetry',
    text: '诗词歌赋',
    desc: '节气相关诗词',
    iconBg: 'linear-gradient(135deg, rgba(170,160,140,0.3), rgba(155,145,125,0.2))',
    svgPath: '<path d="M4 6C4 6 8 2 12 6C16 2 20 6 20 6V18C20 18 16 14 12 18C8 14 4 18 4 18V6Z" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="0.8"/>'
  },
  {
    page: 'farming',
    text: '农事指南',
    desc: '节气农事活动',
    iconBg: 'linear-gradient(135deg, rgba(155,175,155,0.3), rgba(140,160,140,0.2))',
    svgPath: '<path d="M12 20V10" stroke="currentColor" stroke-width="1.2"/><path d="M12 10C12 10 6 6 6 2C12 6 12 10 12 10Z" stroke="currentColor" stroke-width="1" fill="none"/><path d="M12 14C12 14 18 10 18 6C12 10 12 14 12 14Z" stroke="currentColor" stroke-width="1" fill="none"/><line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" stroke-width="1"/>'
  }
]
</script>

<style scoped>
/* ==================== 主页容器 ==================== */
.home-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #c9b8a8 0%, #b8a898 25%, #a89488 50%, #9a8878 75%, #8b7a68 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Serif SC', serif;
  padding: 40px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* 动态渐变叠加层 */
.bg-gradient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  transition: background 0.8s ease;
}

/* ==================== SVG几何装饰（山水/祥云/竹叶/荷花的极简线稿） ==================== */
.deco-svg {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

.deco-svg-1 {
  top: 3%;
  right: 5%;
  width: 220px;
  height: 220px;
  animation: svgFloat1 16s ease-in-out infinite;
}

.deco-svg-2 {
  top: 12%;
  left: 6%;
  width: 140px;
  height: 70px;
  animation: svgFloat2 14s ease-in-out infinite 2s;
}

.deco-svg-3 {
  right: 10%;
  bottom: 18%;
  width: 80px;
  height: 160px;
  animation: svgFloat1 18s ease-in-out infinite 1s;
}

.deco-svg-4 {
  left: 12%;
  bottom: 25%;
  width: 100px;
  height: 100px;
  animation: svgFloat2 12s ease-in-out infinite 3s;
}

.deco-svg-5 {
  top: 45%;
  left: 3%;
  width: 180px;
  height: 90px;
  animation: svgFloat1 15s ease-in-out infinite 4s;
}

@keyframes svgFloat1 {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 1; }
  50% { transform: translateY(-10px) rotate(1deg); opacity: 0.8; }
}

@keyframes svgFloat2 {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 1; }
  50% { transform: translateY(8px) rotate(-1deg); opacity: 0.85; }
}

/* ==================== 浮动几何装饰 ==================== */
.geo-float {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  border-color: rgba(255, 255, 255, 0.06);
}

.geo-float-1 {
  top: 6%;
  right: 18%;
  width: 60px;
  height: 60px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  animation: geoOrbit1 20s linear infinite;
}

.geo-float-2 {
  bottom: 22%;
  left: 8%;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 50% 0 50% 0;
  transform: rotate(30deg);
  animation: geoOrbit2 16s linear infinite;
}

.geo-float-3 {
  top: 55%;
  right: 4%;
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 0 50% 0 50%;
  animation: geoOrbit1 12s linear infinite 2s;
}

.geo-float-4 {
  top: 25%;
  left: 15%;
  width: 16px;
  height: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 50%;
  animation: geoOrbit2 10s linear infinite 1s;
}

.geo-float-5 {
  bottom: 35%;
  right: 20%;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.035);
  border-radius: 50% 0 50% 0;
  transform: rotate(60deg);
  animation: geoOrbit1 14s linear infinite 3s;
}

.geo-float-6 {
  bottom: 8%;
  left: 25%;
  width: 20px;
  height: 20px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 0 50% 0 50%;
  animation: geoOrbit2 18s linear infinite 4s;
}

@keyframes geoOrbit1 {
  0% { transform: rotate(0deg) translateY(0); }
  25% { transform: rotate(90deg) translateY(-6px); }
  50% { transform: rotate(180deg) translateY(0); }
  75% { transform: rotate(270deg) translateY(6px); }
  100% { transform: rotate(360deg) translateY(0); }
}

@keyframes geoOrbit2 {
  0% { transform: rotate(0deg) translateY(0); }
  25% { transform: rotate(-90deg) translateY(5px); }
  50% { transform: rotate(-180deg) translateY(0); }
  75% { transform: rotate(-270deg) translateY(-5px); }
  100% { transform: rotate(-360deg) translateY(0); }
}

/* ==================== 鼠标跟随光晕 ==================== */
.cursor-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
  transition: left 0.3s ease, top 0.3s ease;
}

/* ==================== 标题区域 ==================== */
.home-header {
  text-align: center;
  margin-bottom: 50px;
  z-index: 5;
  animation: headerFadeIn 1s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes headerFadeIn {
  from {
    opacity: 0;
    transform: translateY(-24px);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.header-badge {
  display: inline-block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  padding: 5px 20px;
  border-radius: 14px;
  letter-spacing: 5px;
  margin-bottom: 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: badgePulse 4s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { border-color: rgba(255, 255, 255, 0.1); }
  50% { border-color: rgba(255, 255, 255, 0.2); }
}

/* 标题逐字动画 */
.home-title {
  font-size: 56px;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 18px 0;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  letter-spacing: 14px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  gap: 4px;
}

.title-char {
  display: inline-block;
  animation: charReveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes charReveal {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.9);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* 标题下划线动画 */
.title-line {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.12);
  margin: 0 auto 18px;
  border-radius: 1px;
  overflow: hidden;
  position: relative;
}

.line-fill {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  transform: scaleX(0);
  transform-origin: left;
  animation: lineExpand 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
}

@keyframes lineExpand {
  to { transform: scaleX(1); }
}

.home-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  letter-spacing: 4px;
  font-weight: 300;
  animation: subtitleIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s both;
}

@keyframes subtitleIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==================== 按钮网格 ==================== */
.button-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  max-width: 880px;
  width: 100%;
  z-index: 5;
}

/* 导航按钮 */
.nav-button {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(1.3);
  -webkit-backdrop-filter: blur(20px) saturate(1.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  padding: 30px 22px 26px;
  cursor: pointer;
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  animation: btnStagger 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes btnStagger {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.95);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* 按钮hover光晕 */
.btn-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.btn-glow.is-active {
  opacity: 1;
}

.nav-button:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.nav-button:active {
  transform: translateY(-3px) scale(1.01);
  transition-duration: 0.15s;
}

/* SVG图标容器 */
.btn-icon-wrap {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.nav-button:hover .btn-icon-wrap {
  transform: scale(1.1) rotate(3deg);
  border-color: rgba(255, 255, 255, 0.15);
}

.btn-svg-icon {
  width: 26px;
  height: 26px;
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.3s ease;
}

.nav-button:hover .btn-svg-icon {
  color: rgba(255, 255, 255, 0.95);
}

.button-text {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 4px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.nav-button:hover .button-text {
  letter-spacing: 5px;
  color: rgba(255, 255, 255, 0.98);
}

.button-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 1px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.nav-button:hover .button-desc {
  color: rgba(255, 255, 255, 0.55);
}

/* 按钮箭头指示 */
.btn-arrow {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%) translateX(-8px);
  opacity: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.btn-arrow.is-visible {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* ==================== 底部诗句 ==================== */
.home-footer {
  position: absolute;
  bottom: 28px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 4px;
  font-weight: 300;
  z-index: 5;
  display: flex;
}

.footer-char {
  display: inline-block;
  animation: footerCharIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes footerCharIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==================== 响应式布局 ==================== */
@media (max-width: 768px) {
  .button-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .home-title {
    font-size: 38px;
    letter-spacing: 8px;
  }

  .home-subtitle {
    font-size: 13px;
    letter-spacing: 2px;
  }

  .nav-button {
    padding: 22px 16px 18px;
  }

  .btn-icon-wrap {
    width: 44px;
    height: 44px;
  }

  .button-text {
    font-size: 16px;
    letter-spacing: 3px;
  }

  .deco-svg-1 { width: 140px; height: 140px; }
  .deco-svg-2 { width: 100px; height: 50px; }
  .deco-svg-3 { width: 50px; height: 100px; }
  .deco-svg-4 { width: 60px; height: 60px; }
  .deco-svg-5 { width: 120px; height: 60px; }
}
</style>
