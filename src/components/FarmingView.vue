<template>
  <div class="farming-page" @mousemove="handleMouseMove">
    <!-- SVG几何装饰（山水/祥云/竹叶/麦穗极简线稿） -->
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
    <!-- 麦穗线稿装饰 -->
    <svg class="deco-svg deco-svg-4" viewBox="0 0 60 120" fill="none">
      <path d="M30 10 V110" stroke="rgba(139,115,85,0.04)" stroke-width="1"/>
      <path d="M30 30 Q20 25 18 35" stroke="rgba(139,115,85,0.05)" stroke-width="0.8" fill="none"/>
      <path d="M30 45 Q40 40 42 50" stroke="rgba(139,115,85,0.05)" stroke-width="0.8" fill="none"/>
      <path d="M30 60 Q20 55 18 65" stroke="rgba(139,115,85,0.04)" stroke-width="0.8" fill="none"/>
      <path d="M30 75 Q40 70 42 80" stroke="rgba(139,115,85,0.04)" stroke-width="0.8" fill="none"/>
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
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'poetry')">诗词歌赋</a>
        <a href="#" class="nav-link active" @click.prevent="$emit('navigate', 'farming')">农事指南</a>
      </div>
    </nav>

    <div class="page-content">
      <div class="page-header">
        <div class="header-badge">农事历法</div>
        <h1>农事指南</h1>
        <div class="title-line"><div class="title-line-fill"></div></div>
        <p class="header-desc">顺天应时，不违农时，千年农耕智慧</p>
      </div>

      <div class="farming-grid">
        <div
          v-for="(item, idx) in farmingItems"
          :key="item.season"
          class="farming-card"
          :style="{ animationDelay: idx * 0.12 + 's' }"
          @mouseenter="hoveredCard = idx"
          @mouseleave="hoveredCard = -1"
        >
          <div class="card-glow" :class="{ 'is-active': hoveredCard === idx }"></div>
          <div class="card-header" :style="{ background: item.gradient }">
            <svg class="card-svg-icon" viewBox="0 0 24 24" fill="none" v-html="item.svgPath"></svg>
            <span class="card-season">{{ item.label }}</span>
          </div>
          <div class="card-body">
            <div v-for="(task, i) in item.tasks" :key="i" class="task-item">
              <div class="task-period">{{ task.period }}</div>
              <div class="task-desc">{{ task.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 农谚区域 -->
      <div class="proverb-section">
        <div class="season-header">
          <svg class="season-icon-svg" viewBox="0 0 20 20" fill="none">
            <path d="M10 3L16 8V14L10 19L4 14V8L10 3Z" stroke="currentColor" stroke-width="1" fill="none"/>
            <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="0.8" fill="none"/>
          </svg>
          <span class="season-name">农谚智慧</span>
          <div class="season-line"></div>
        </div>
        <div class="proverb-grid">
          <div
            v-for="(proverb, idx) in proverbs"
            :key="idx"
            class="proverb-card"
            :style="{ animationDelay: idx * 0.08 + 's' }"
            @mouseenter="hoveredProverb = idx"
            @mouseleave="hoveredProverb = -1"
          >
            <svg class="proverb-quote" viewBox="0 0 16 16" fill="none">
              <path d="M2 8Q2 3 7 2V5Q5 5 5 8H2Z" stroke="currentColor" stroke-width="0.8" fill="none"/>
              <path d="M9 8Q9 3 14 2V5Q12 5 12 8H9Z" stroke="currentColor" stroke-width="0.8" fill="none"/>
            </svg>
            <span class="proverb-text">{{ proverb }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
defineEmits(['navigate'])

const hoveredCard = ref(-1)
const hoveredProverb = ref(-1)

const mousePos = reactive({ x: 0.5, y: 0.5 })
const handleMouseMove = (e) => {
  mousePos.x = e.clientX / window.innerWidth
  mousePos.y = e.clientY / window.innerHeight
}
const cursorGlowStyle = computed(() => ({
  left: `${mousePos.x * 100}%`,
  top: `${mousePos.y * 100}%`
}))

const farmingItems = [
  {
    season: 'spring',
    label: '春季农事',
    gradient: 'linear-gradient(135deg, #c9b8a8, #b8a898)',
    svgPath: '<path d="M12 20V10" stroke="currentColor" stroke-width="1.2"/><path d="M12 10C12 10 6 6 6 2C12 6 12 10 12 10Z" stroke="currentColor" stroke-width="1" fill="none"/><path d="M12 14C12 14 18 10 18 6C12 10 12 14 12 14Z" stroke="currentColor" stroke-width="1" fill="none"/><line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" stroke-width="1"/>',
    tasks: [
      { period: '立春-雨水', desc: '整地备耕，准备种子' },
      { period: '惊蛰-春分', desc: '播种春作物，果树修剪' },
      { period: '清明-谷雨', desc: '水稻育秧，茶园采摘' }
    ]
  },
  {
    season: 'summer',
    label: '夏季农事',
    gradient: 'linear-gradient(135deg, #9aab9e, #8d9e8f)',
    svgPath: '<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M12 8V12L15 15" stroke="currentColor" stroke-width="1" fill="none"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="0.8" fill="none"/>',
    tasks: [
      { period: '立夏-小满', desc: '小麦灌浆，中耕除草' },
      { period: '芒种-夏至', desc: '抢收小麦，插秧播种' },
      { period: '小暑-大暑', desc: '田间管理，防旱防涝' }
    ]
  },
  {
    season: 'autumn',
    label: '秋季农事',
    gradient: 'linear-gradient(135deg, #c4b498, #b8a488)',
    svgPath: '<rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="0.8"/><line x1="8" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="0.8"/><line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" stroke-width="0.8"/>',
    tasks: [
      { period: '立秋-处暑', desc: '秋作物管理，防治病虫害' },
      { period: '白露-秋分', desc: '收获秋粮，播种冬小麦' },
      { period: '寒露-霜降', desc: '秋收扫尾，储藏粮食' }
    ]
  },
  {
    season: 'winter',
    label: '冬季农事',
    gradient: 'linear-gradient(135deg, #b3bec8, #a4b0bb)',
    svgPath: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="12" y1="3" x2="12" y2="7" stroke="currentColor" stroke-width="0.8"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="0.8"/><line x1="3" y1="12" x2="7" y2="12" stroke="currentColor" stroke-width="0.8"/><line x1="17" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="0.8"/>',
    tasks: [
      { period: '立冬-小雪', desc: '农田水利建设，积肥' },
      { period: '大雪-冬至', desc: '温室管理，果树防寒' },
      { period: '小寒-大寒', desc: '总结规划，修整农具' }
    ]
  }
]

const proverbs = [
  '立春一年端，种地早盘算',
  '清明前后，种瓜点豆',
  '谷雨前后栽地瓜，最好不要过立夏',
  '芒种忙忙种，夏至谷怀胎',
  '秋分不生田，打算动刀镰',
  '霜降不起葱，越长越要空',
  '小寒大寒，冷成冰团',
  '冬至不过不寒，夏至不过不热'
]
</script>

<style scoped>
.farming-page {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(160deg, #ddd8d2 0%, #cec8c0 30%, #c0b8ac 60%, #b5aa9c 100%);
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
  top: 15%;
  right: 6%;
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
  top: 25%;
  left: 5%;
  width: 60px;
  height: 120px;
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

/* ==================== 农事卡片网格 ==================== */
.farming-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 56px;
}

.farming-card {
  background: rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  position: relative;
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
  z-index: 1;
}

.card-glow.is-active { opacity: 1; }

.farming-card:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.05);
  border-color: rgba(255, 255, 255, 0.35);
}

.card-header {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-svg-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.85);
  transition: transform 0.3s ease;
}

.farming-card:hover .card-svg-icon {
  transform: scale(1.15) rotate(5deg);
}

.card-season {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 4px;
}

.card-body {
  padding: 8px 24px 20px;
}

.task-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(139, 115, 85, 0.06);
  transition: all 0.3s ease;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item:hover {
  padding-left: 6px;
}

.task-period {
  font-size: 13px;
  color: rgba(139, 115, 85, 0.55);
  white-space: nowrap;
  min-width: 80px;
  letter-spacing: 1px;
}

.task-desc {
  font-size: 14px;
  color: rgba(80, 70, 55, 0.6);
  letter-spacing: 1px;
}

/* ==================== 农谚区域 ==================== */
.proverb-section {
  animation: sectionIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

@keyframes sectionIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.season-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.season-icon-svg {
  width: 18px;
  height: 18px;
  color: rgba(139, 115, 85, 0.45);
}

.season-name {
  font-size: 18px;
  font-weight: 600;
  color: rgba(80, 70, 55, 0.72);
  letter-spacing: 4px;
}

.season-line {
  flex: 1;
  height: 1px;
  background: rgba(139, 115, 85, 0.1);
}

.proverb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.proverb-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.proverb-card:hover {
  background: rgba(255, 255, 255, 0.38);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.25);
}

.proverb-quote {
  width: 14px;
  height: 14px;
  color: rgba(139, 115, 85, 0.25);
  flex-shrink: 0;
  margin-top: 2px;
  transition: color 0.3s ease;
}

.proverb-card:hover .proverb-quote {
  color: rgba(139, 115, 85, 0.4);
}

.proverb-text {
  font-size: 14px;
  color: rgba(80, 70, 55, 0.6);
  letter-spacing: 2px;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.proverb-card:hover .proverb-text {
  color: rgba(80, 70, 55, 0.75);
}

@media (max-width: 768px) {
  .farming-grid {
    grid-template-columns: 1fr;
  }
  .page-content {
    padding: 80px 20px 40px;
  }
}
</style>
