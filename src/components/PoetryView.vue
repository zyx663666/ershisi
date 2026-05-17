<template>
  <div class="poetry-page" @mousemove="handleMouseMove">
    <!-- SVG几何装饰（山水/祥云/竹叶/荷花极简线稿） -->
    <svg class="deco-svg deco-svg-1" viewBox="0 0 200 200" fill="none">
      <path d="M20 180 Q60 100 100 140 Q140 80 180 120" stroke="rgba(139,115,85,0.06)" stroke-width="1.5" fill="none"/>
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
      <path d="M40 100 Q25 90 20 105" stroke="rgba(139,115,85,0.04)" stroke-width="0.8" fill="none"/>
    </svg>
    <!-- 荷花线稿装饰 -->
    <svg class="deco-svg deco-svg-4" viewBox="0 0 100 100" fill="none">
      <path d="M50 10 Q70 30 50 50 Q30 30 50 10" stroke="rgba(139,115,85,0.05)" stroke-width="1" fill="none"/>
      <path d="M50 50 Q70 70 50 90 Q30 70 50 50" stroke="rgba(139,115,85,0.04)" stroke-width="1" fill="none"/>
      <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(139,115,85,0.03)" stroke-width="0.6"/>
    </svg>

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
        <a href="#" class="nav-link active" @click.prevent="$emit('navigate', 'poetry')">诗词歌赋</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'farming')">农事指南</a>
      </div>
    </nav>

    <div class="page-content">
      <div class="page-header">
        <div class="header-badge">诗词雅韵</div>
        <h1>诗词歌赋</h1>
        <div class="title-line"><div class="title-line-fill"></div></div>
        <p class="header-desc">千年诗韵映节气，一字一句皆风华</p>
      </div>

      <div class="poetry-grid">
        <div
          v-for="(poem, idx) in poems"
          :key="poem.title"
          class="poetry-card"
          :style="{ animationDelay: idx * 0.1 + 's' }"
          @mouseenter="hoveredCard = idx"
          @mouseleave="hoveredCard = -1"
        >
          <div class="card-glow" :class="{ 'is-active': hoveredCard === idx }"></div>
          <div class="poem-header">
            <svg class="poem-season-svg" viewBox="0 0 16 16" fill="none" v-html="poem.svgPath"></svg>
            <span class="poem-season">{{ poem.season }}</span>
          </div>
          <h3 class="poem-title">{{ poem.title }}</h3>
          <p class="poem-author">{{ poem.author }}</p>
          <div class="poem-body">
            <p v-for="(line, i) in poem.lines" :key="i" class="poem-line">{{ line }}</p>
          </div>
          <div class="poem-divider"></div>
          <p class="poem-note">{{ poem.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
defineEmits(['navigate'])

const hoveredCard = ref(-1)

const mousePos = reactive({ x: 0.5, y: 0.5 })
const handleMouseMove = (e) => {
  mousePos.x = e.clientX / window.innerWidth
  mousePos.y = e.clientY / window.innerHeight
}
const cursorGlowStyle = computed(() => ({
  left: `${mousePos.x * 100}%`,
  top: `${mousePos.y * 100}%`
}))

const poems = [
  {
    title: '春晓',
    author: '孟浩然',
    season: '春',
    dotColor: '#c9b8a8',
    svgPath: '<path d="M8 4 Q12 8 8 12 Q4 8 8 4Z" stroke="currentColor" stroke-width="1" fill="none"/><path d="M8 12 Q12 16 8 18 Q4 16 8 12Z" stroke="currentColor" stroke-width="0.8" fill="none"/>',
    lines: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'],
    note: '惊蛰时节，春意渐浓'
  },
  {
    title: '清明',
    author: '杜牧',
    season: '春',
    dotColor: '#c9b8a8',
    svgPath: '<path d="M8 4 Q12 8 8 12 Q4 8 8 4Z" stroke="currentColor" stroke-width="1" fill="none"/><path d="M8 12 Q12 16 8 18 Q4 16 8 12Z" stroke="currentColor" stroke-width="0.8" fill="none"/>',
    lines: ['清明时节雨纷纷，路上行人欲断魂。', '借问酒家何处有，牧童遥指杏花村。'],
    note: '清明时节，烟雨江南'
  },
  {
    title: '夏至避暑北池',
    author: '韦应物',
    season: '夏',
    dotColor: '#9aab9e',
    svgPath: '<path d="M8 3L14 13H2L8 3Z" stroke="currentColor" stroke-width="1" fill="none"/>',
    lines: ['昼晷已云极，宵漏自此长。', '绿筠尚含粉，圆荷始散芳。'],
    note: '夏至日长，荷风送香'
  },
  {
    title: '秋夕',
    author: '杜牧',
    season: '秋',
    dotColor: '#c4b498',
    svgPath: '<rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1" fill="none"/>',
    lines: ['银烛秋光冷画屏，轻罗小扇扑流萤。', '天阶夜色凉如水，卧看牵牛织女星。'],
    note: '秋分时节，天高气爽'
  },
  {
    title: '冬至',
    author: '杜甫',
    season: '冬',
    dotColor: '#b3bec8',
    svgPath: '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1" fill="none"/><line x1="8" y1="2" x2="8" y2="5" stroke="currentColor" stroke-width="0.6"/><line x1="8" y1="11" x2="8" y2="14" stroke="currentColor" stroke-width="0.6"/>',
    lines: ['天时人事日相催，冬至阳生春又来。', '刺绣五纹添弱线，吹葭六琯动浮灰。'],
    note: '冬至阳生，数九寒天'
  },
  {
    title: '小寒',
    author: '元稹',
    season: '冬',
    dotColor: '#b3bec8',
    svgPath: '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1" fill="none"/><line x1="8" y1="2" x2="8" y2="5" stroke="currentColor" stroke-width="0.6"/><line x1="8" y1="11" x2="8" y2="14" stroke="currentColor" stroke-width="0.6"/>',
    lines: ['小寒连大吕，欢鹊垒新巢。', '拾食寻河曲，衔紫绕树梢。'],
    note: '小寒初至，鹊始营巢'
  }
]
</script>

<style scoped>
.poetry-page {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(160deg, #e2dbd5 0%, #d3cac2 30%, #c5b9ad 60%, #bba998 100%);
  overflow-y: auto;
  padding: 0 0 60px;
  box-sizing: border-box;
  font-family: 'Noto Serif SC', serif;
  position: relative;
}

/* ==================== SVG几何装饰 ==================== */
.deco-svg {
  position: fixed;
  pointer-events: none;
  z-index: 0;
}

.deco-svg-1 {
  top: 10%;
  right: 5%;
  width: 180px;
  height: 180px;
  animation: svgFloat 16s ease-in-out infinite;
}

.deco-svg-2 {
  bottom: 20%;
  left: 4%;
  width: 120px;
  height: 60px;
  animation: svgFloat 14s ease-in-out infinite 2s;
}

.deco-svg-3 {
  top: 50%;
  right: 3%;
  width: 70px;
  height: 140px;
  animation: svgFloat 18s ease-in-out infinite 1s;
}

.deco-svg-4 {
  top: 30%;
  left: 6%;
  width: 100px;
  height: 100px;
  animation: svgFloat 12s ease-in-out infinite 3s;
}

@keyframes svgFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* ==================== 鼠标跟随光晕 ==================== */
.cursor-glow {
  position: fixed;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
  transition: left 0.4s ease, top 0.4s ease;
}

/* ==================== 导航栏 ==================== */
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

.nav-logo:hover { opacity: 0.7; }

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

.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(80, 70, 55, 0.9);
  font-weight: 600;
}

/* ==================== 页面内容 ==================== */
.page-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 90px 40px 40px;
  position: relative;
  z-index: 1;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  animation: headerIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes headerIn {
  from { opacity: 0; transform: translateY(-16px); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.header-badge {
  display: inline-block;
  font-size: 11px;
  color: rgba(139, 115, 85, 0.55);
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(10px);
  padding: 4px 16px;
  border-radius: 12px;
  letter-spacing: 3px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.page-header h1 {
  font-size: 38px;
  color: rgba(80, 70, 55, 0.88);
  margin: 0 0 12px;
  letter-spacing: 8px;
  font-weight: 700;
}

.title-line {
  width: 50px;
  height: 2px;
  background: rgba(139, 115, 85, 0.1);
  margin: 0 auto 14px;
  border-radius: 1px;
  overflow: hidden;
}

.title-line-fill {
  width: 100%;
  height: 100%;
  background: rgba(139, 115, 85, 0.25);
  transform: scaleX(0);
  transform-origin: left;
  animation: lineGrow 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
}

@keyframes lineGrow { to { transform: scaleX(1); } }

.header-desc {
  font-size: 14px;
  color: rgba(100, 90, 75, 0.45);
  letter-spacing: 2px;
  margin: 0;
}

/* ==================== 诗词卡片网格 ==================== */
.poetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.poetry-card {
  background: rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  position: relative;
  overflow: hidden;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.card-glow.is-active { opacity: 1; }

.poetry-card:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.05);
  border-color: rgba(255, 255, 255, 0.35);
}

.poem-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.poem-season-svg {
  width: 14px;
  height: 14px;
  color: rgba(139, 115, 85, 0.5);
  transition: transform 0.3s ease;
}

.poetry-card:hover .poem-season-svg {
  transform: scale(1.2) rotate(5deg);
}

.poem-season {
  font-size: 12px;
  color: rgba(139, 115, 85, 0.5);
  letter-spacing: 2px;
}

.poem-title {
  font-size: 24px;
  color: rgba(80, 70, 55, 0.85);
  margin: 0 0 6px;
  letter-spacing: 4px;
  font-weight: 700;
  transition: letter-spacing 0.3s ease;
}

.poetry-card:hover .poem-title {
  letter-spacing: 5px;
}

.poem-author {
  font-size: 13px;
  color: rgba(139, 115, 85, 0.5);
  margin: 0 0 18px;
  letter-spacing: 2px;
}

.poem-body {
  margin-bottom: 16px;
}

.poem-line {
  font-size: 16px;
  color: rgba(80, 70, 55, 0.7);
  line-height: 2.2;
  margin: 0;
  letter-spacing: 2px;
  transition: color 0.3s ease;
}

.poetry-card:hover .poem-line {
  color: rgba(80, 70, 55, 0.8);
}

.poem-divider {
  width: 30px;
  height: 1px;
  background: rgba(139, 115, 85, 0.12);
  margin: 0 0 12px;
  transition: width 0.3s ease;
}

.poetry-card:hover .poem-divider {
  width: 50px;
  background: rgba(139, 115, 85, 0.2);
}

.poem-note {
  font-size: 12px;
  color: rgba(139, 115, 85, 0.4);
  letter-spacing: 1px;
  margin: 0;
}

@media (max-width: 768px) {
  .poetry-grid {
    grid-template-columns: 1fr;
  }
  .page-content {
    padding: 80px 20px 40px;
  }
}
</style>
