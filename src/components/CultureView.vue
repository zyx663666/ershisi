<template>
  <div class="culture-page" @mousemove="handleMouseMove">
    <!-- SVG几何装饰（山水/祥云/竹叶极简线稿） -->
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
        <a href="#" class="nav-link active" @click.prevent="$emit('navigate', 'culture')">传统文化</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'poetry')">诗词歌赋</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'farming')">农事指南</a>
      </div>
    </nav>

    <div class="page-content">
      <div class="page-header">
        <div class="header-badge">文化传承</div>
        <h1>传统文化</h1>
        <div class="title-line"><div class="title-line-fill"></div></div>
        <p class="header-desc">节气承载千年民俗，蕴藏东方生活美学</p>
      </div>

      <div class="culture-grid">
        <div
          v-for="(item, idx) in cultureItems"
          :key="item.title"
          class="culture-card"
          :style="{ animationDelay: idx * 0.1 + 's' }"
          @mouseenter="hoveredCard = idx"
          @mouseleave="hoveredCard = -1"
        >
          <div class="card-glow" :class="{ 'is-active': hoveredCard === idx }"></div>
          <div class="card-icon-wrap" :style="{ background: item.iconBg }">
            <svg class="card-svg-icon" viewBox="0 0 24 24" fill="none" v-html="item.svgPath"></svg>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <div class="card-tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- 节气习俗时间轴 -->
      <div class="timeline-section">
        <div class="season-header">
          <svg class="season-icon-svg" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1" fill="none"/>
            <path d="M10 6 Q12 8 10 10 Q8 8 10 6Z" stroke="currentColor" stroke-width="0.8" fill="none"/>
            <path d="M10 10 Q12 12 10 14 Q8 12 10 10Z" stroke="currentColor" stroke-width="0.8" fill="none"/>
          </svg>
          <span class="season-name">四季习俗</span>
          <div class="season-line"></div>
        </div>
        <div class="timeline">
          <div
            v-for="(item, idx) in timelineItems"
            :key="idx"
            class="timeline-item"
            :style="{ animationDelay: idx * 0.12 + 's' }"
            @mouseenter="hoveredTimeline = idx"
            @mouseleave="hoveredTimeline = -1"
          >
            <div class="timeline-dot-wrap">
              <div class="timeline-dot" :style="{ background: item.dotColor }"></div>
              <div class="timeline-dot-ring" :class="{ 'is-active': hoveredTimeline === idx }" :style="{ borderColor: item.dotColor }"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-season">
                <svg class="timeline-season-svg" viewBox="0 0 16 16" fill="none" v-html="item.svgPath"></svg>
                {{ item.season }}
              </div>
              <div class="timeline-text">{{ item.text }}</div>
            </div>
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
const hoveredTimeline = ref(-1)

const mousePos = reactive({ x: 0.5, y: 0.5 })
const handleMouseMove = (e) => {
  mousePos.x = e.clientX / window.innerWidth
  mousePos.y = e.clientY / window.innerHeight
}
const cursorGlowStyle = computed(() => ({
  left: `${mousePos.x * 100}%`,
  top: `${mousePos.y * 100}%`
}))

const cultureItems = [
  {
    title: '节气饮食',
    desc: '每个节气都有对应的传统美食，如立春吃春饼、冬至吃饺子，以食养生、以味应时。',
    tags: ['春饼', '饺子', '汤圆', '粽子'],
    iconBg: 'linear-gradient(135deg, #c9b8a8, #b8a898)',
    svgPath: '<path d="M12 4C8 4 4 7 4 10C4 13 8 16 12 16C16 16 20 13 20 10C20 7 16 4 12 4Z" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M8 10Q10 8 12 10Q14 8 16 10" stroke="currentColor" stroke-width="0.8" fill="none"/><line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" stroke-width="1"/><line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" stroke-width="1"/>'
  },
  {
    title: '节气习俗',
    desc: '清明扫墓、端午赛龙舟、中秋赏月，节气承载着丰富的民俗文化与传统仪式。',
    tags: ['扫墓', '龙舟', '赏月', '祭灶'],
    iconBg: 'linear-gradient(135deg, #9aab9e, #8d9e8f)',
    svgPath: '<path d="M12 3L20 8V16L12 21L4 16V8L12 3Z" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M12 8L16 10.5V15.5L12 18L8 15.5V10.5L12 8Z" stroke="currentColor" stroke-width="0.8" fill="none"/>'
  },
  {
    title: '养生之道',
    desc: '顺应节气变化调整作息和饮食，春养肝、夏养心、秋养肺、冬养肾，天人合一。',
    tags: ['春养肝', '夏养心', '秋养肺', '冬养肾'],
    iconBg: 'linear-gradient(135deg, #c4b498, #b8a488)',
    svgPath: '<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M12 8V12L15 15" stroke="currentColor" stroke-width="1" fill="none"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="0.8" fill="none"/>'
  },
  {
    title: '节气服饰',
    desc: '古人根据节气变化更换衣物，从轻纱到厚裘，体现人与自然和谐共处的智慧。',
    tags: ['轻纱', '罗裳', '裘衣', '棉袍'],
    iconBg: 'linear-gradient(135deg, #b3bec8, #a4b0bb)',
    svgPath: '<path d="M12 3L8 7V17L12 21L16 17V7L12 3Z" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" stroke-width="0.8"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="0.6"/><line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" stroke-width="0.8"/>'
  }
]

const timelineItems = [
  {
    season: '春',
    text: '立春鞭牛、清明踏青、谷雨品茶',
    dotColor: '#c9b8a8',
    svgPath: '<path d="M8 4 Q12 8 8 12 Q4 8 8 4Z" stroke="currentColor" stroke-width="1" fill="none"/>'
  },
  {
    season: '夏',
    text: '立夏称人、端午龙舟、大暑伏天',
    dotColor: '#9aab9e',
    svgPath: '<path d="M8 3L14 13H2L8 3Z" stroke="currentColor" stroke-width="1" fill="none"/>'
  },
  {
    season: '秋',
    text: '立秋晒秋、中秋赏月、霜降赏菊',
    dotColor: '#c4b498',
    svgPath: '<rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1" fill="none"/>'
  },
  {
    season: '冬',
    text: '立冬补冬、冬至数九、大寒守岁',
    dotColor: '#b3bec8',
    svgPath: '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1" fill="none"/><line x1="8" y1="2" x2="8" y2="5" stroke="currentColor" stroke-width="0.6"/><line x1="8" y1="11" x2="8" y2="14" stroke="currentColor" stroke-width="0.6"/>'
  }
]
</script>

<style scoped>
.culture-page {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(160deg, #e5ddd4 0%, #d5cbc0 30%, #c8bca8 60%, #bfb2a0 100%);
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
  top: 12%;
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

/* ==================== 文化卡片网格 ==================== */
.culture-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 56px;
}

.culture-card {
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

.culture-card:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.05);
  border-color: rgba(255, 255, 255, 0.35);
}

.card-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.culture-card:hover .card-icon-wrap {
  transform: scale(1.08) rotate(3deg);
}

.card-svg-icon {
  width: 22px;
  height: 22px;
  color: rgba(255, 255, 255, 0.85);
}

.culture-card h3 {
  font-size: 20px;
  color: rgba(80, 70, 55, 0.85);
  margin: 0 0 10px;
  letter-spacing: 3px;
  font-weight: 600;
}

.culture-card p {
  font-size: 14px;
  color: rgba(100, 90, 75, 0.6);
  line-height: 1.8;
  margin: 0 0 16px;
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 11px;
  color: rgba(139, 115, 85, 0.55);
  background: rgba(255, 255, 255, 0.22);
  padding: 3px 12px;
  border-radius: 10px;
  letter-spacing: 1px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.3s ease;
}

.tag:hover {
  background: rgba(255, 255, 255, 0.38);
  color: rgba(100, 90, 75, 0.75);
  transform: translateY(-1px);
}

/* ==================== 时间轴 ==================== */
.timeline-section {
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
  margin-bottom: 24px;
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

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 24px;
  border-left: 2px solid rgba(139, 115, 85, 0.08);
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  position: relative;
  animation: itemIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  transition: padding-left 0.3s ease;
}

.timeline-item:hover {
  padding-left: 6px;
}

@keyframes itemIn {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
}

.timeline-dot-wrap {
  position: relative;
  flex-shrink: 0;
  margin-top: 3px;
  margin-left: -30px;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
}

.timeline-item:hover .timeline-dot {
  transform: scale(1.3);
}

.timeline-dot-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid transparent;
  opacity: 0;
  transition: all 0.3s ease;
}

.timeline-dot-ring.is-active {
  opacity: 0.4;
  inset: -8px;
}

.timeline-content {
  flex: 1;
}

.timeline-season {
  font-size: 16px;
  font-weight: 600;
  color: rgba(80, 70, 55, 0.75);
  margin-bottom: 4px;
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.timeline-season-svg {
  width: 14px;
  height: 14px;
  color: rgba(139, 115, 85, 0.5);
}

.timeline-text {
  font-size: 14px;
  color: rgba(100, 90, 75, 0.55);
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .culture-grid {
    grid-template-columns: 1fr;
  }
  .page-content {
    padding: 80px 20px 40px;
  }
}
</style>
