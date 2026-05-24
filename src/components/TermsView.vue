<template>
  <div class="terms-page" @mousemove="handleMouseMove">
    <!-- SVG几何装饰 -->
    <svg class="deco-svg deco-svg-1" viewBox="0 0 200 200" fill="none">
      <path d="M20 180 Q60 100 100 140 Q140 80 180 120" stroke="rgba(139,115,85,0.06)" stroke-width="1.5" fill="none"/>
      <path d="M10 190 Q50 130 90 160 Q130 110 170 140" stroke="rgba(139,115,85,0.04)" stroke-width="1" fill="none"/>
    </svg>
    <svg class="deco-svg deco-svg-2" viewBox="0 0 120 60" fill="none">
      <path d="M10 50 Q30 10 60 30 Q90 10 110 50" stroke="rgba(139,115,85,0.05)" stroke-width="1.2" fill="none"/>
    </svg>
    <svg class="deco-svg deco-svg-3" viewBox="0 0 80 160" fill="none">
      <path d="M40 10 L40 150" stroke="rgba(139,115,85,0.04)" stroke-width="1"/>
      <path d="M40 40 Q20 30 15 45" stroke="rgba(139,115,85,0.05)" stroke-width="0.8" fill="none"/>
      <path d="M40 70 Q60 60 65 75" stroke="rgba(139,115,85,0.05)" stroke-width="0.8" fill="none"/>
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
        <a href="#" class="nav-link active" @click.prevent="$emit('navigate', 'terms')">节气介绍</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'culture')">传统文化</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'poetry')">诗词歌赋</a>
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'farming')">农事指南</a>
      </div>
    </nav>

    <div class="page-content">
      <div class="page-header">
        <div class="header-badge">节气百科</div>
        <h1>节气介绍</h1>
        <div class="title-line"><div class="title-line-fill"></div></div>
        <p class="header-desc">二十四节气，是古人依据黄道面划分制定的气候规律</p>
      </div>

      <div class="season-section" v-for="season in seasonGroups" :key="season.name">
        <div class="season-header">
          <svg class="season-icon-svg" viewBox="0 0 20 20" fill="none" v-html="season.svgPath"></svg>
          <span class="season-name">{{ season.label }}</span>
          <div class="season-line"></div>
        </div>
        <div class="terms-grid" :class="'grid-' + season.name">
          <div
            v-for="(term, idx) in season.terms"
            :key="term.name"
            class="term-card"
            :style="{ animationDelay: idx * 0.08 + 's' }"
          >
            <div class="card-top" :style="{ background: term.gradient }">
              <svg class="card-deco-svg" viewBox="0 0 24 24" fill="none" v-html="term.decoSvg"></svg>
              <span class="card-name">{{ term.name }}</span>
            </div>
            <div class="card-body">
              <div class="card-pinyin">{{ term.pinyin }}</div>
              <div class="card-date">{{ term.date }}</div>
              <div class="card-divider" :style="{ background: term.color }"></div>
              <div class="card-desc">{{ term.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { terms } from '../data/terms.js'
defineEmits(['navigate'])

const mousePos = reactive({ x: 0.5, y: 0.5 })
const handleMouseMove = (e) => {
  mousePos.x = e.clientX / window.innerWidth
  mousePos.y = e.clientY / window.innerHeight
}
const cursorGlowStyle = computed(() => ({
  left: `${mousePos.x * 100}%`,
  top: `${mousePos.y * 100}%`
}))

const seasonConfig = {
  '春': {
    label: '春季',
    svgPath: '<path d="M10 4 Q14 8 10 12 Q6 8 10 4Z" stroke="currentColor" stroke-width="1" fill="none"/><path d="M10 12 Q14 16 10 18 Q6 16 10 12Z" stroke="currentColor" stroke-width="0.8" fill="none"/>'
  },
  '夏': {
    label: '夏季',
    svgPath: '<path d="M10 3L18 17H2L10 3Z" stroke="currentColor" stroke-width="1" fill="none"/>'
  },
  '秋': {
    label: '秋季',
    svgPath: '<rect x="4" y="4" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1" fill="none"/>'
  },
  '冬': {
    label: '冬季',
    svgPath: '<circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1" fill="none"/><line x1="10" y1="3" x2="10" y2="7" stroke="currentColor" stroke-width="0.6"/><line x1="10" y1="13" x2="10" y2="17" stroke="currentColor" stroke-width="0.6"/>'
  }
}

const seasonGroups = computed(() => {
  const groups = {}
  terms.forEach(term => {
    if (!groups[term.season]) groups[term.season] = []
    groups[term.season].push(term)
  })
  return Object.keys(groups).map(key => ({
    name: key,
    ...seasonConfig[key],
    terms: groups[key]
  }))
})
</script>

<style scoped>
.terms-page {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(160deg, #e8e0d8 0%, #d8cfc5 30%, #c9bfb3 60%, #bfb3a5 100%);
  overflow-y: auto;
  padding: 0 0 80px;
  box-sizing: border-box;
  font-family: 'Noto Serif SC', serif;
  position: relative;
}

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

.cursor-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
  transition: left 0.4s ease, top 0.4s ease;
}

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

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 60px 60px;
  position: relative;
  z-index: 1;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
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
  font-size: 42px;
  color: rgba(80, 70, 55, 0.88);
  margin: 0 0 12px;
  letter-spacing: 10px;
  font-weight: 700;
}

.title-line {
  width: 60px;
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
  font-size: 15px;
  color: rgba(100, 90, 75, 0.45);
  letter-spacing: 2px;
  margin: 0;
}

.season-section {
  margin-bottom: 56px;
  animation: sectionIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
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
  width: 20px;
  height: 20px;
  color: rgba(139, 115, 85, 0.45);
}

.season-name {
  font-size: 20px;
  font-weight: 600;
  color: rgba(80, 70, 55, 0.72);
  letter-spacing: 5px;
}

.season-line {
  flex: 1;
  height: 1px;
  background: rgba(139, 115, 85, 0.1);
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.grid-春 { grid-template-columns: repeat(3, 1fr); }
.grid-夏 { grid-template-columns: repeat(3, 1fr); }
.grid-秋 { grid-template-columns: repeat(3, 1fr); }
.grid-冬 { grid-template-columns: repeat(3, 1fr); }

.term-card {
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.03);
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  cursor: default;
  position: relative;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.term-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.07);
  border-color: rgba(255, 255, 255, 0.4);
}

.term-card:hover .card-deco-svg {
  opacity: 0.4;
  transform: scale(1.15) rotate(5deg);
}

.term-card:hover .card-name {
  letter-spacing: 8px;
}

.card-top {
  padding: 28px 20px 22px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.card-deco-svg {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 48px;
  height: 48px;
  color: rgba(255, 255, 255, 0.2);
  opacity: 0.25;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-name {
  font-size: 30px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 6px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: letter-spacing 0.4s ease;
  position: relative;
  z-index: 1;
}

.card-body {
  padding: 18px 20px 24px;
  text-align: center;
}

.card-pinyin {
  font-size: 14px;
  color: rgba(139, 115, 85, 0.5);
  letter-spacing: 3px;
  margin-bottom: 6px;
  font-weight: 300;
}

.card-date {
  font-size: 12px;
  color: rgba(139, 115, 85, 0.35);
  letter-spacing: 1px;
  margin-bottom: 14px;
}

.card-divider {
  width: 32px;
  height: 2px;
  margin: 0 auto 14px;
  border-radius: 1px;
  opacity: 0.4;
  transition: width 0.4s ease, opacity 0.4s ease;
}

.term-card:hover .card-divider {
  width: 56px;
  opacity: 0.7;
}

.card-desc {
  font-size: 14px;
  color: rgba(80, 70, 55, 0.6);
  line-height: 1.8;
  letter-spacing: 1px;
}

@media (min-width: 1400px) {
  .page-content {
    max-width: 1400px;
    padding: 110px 80px 80px;
  }
  .grid-春 { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .grid-夏 { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .grid-秋 { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .grid-冬 { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .card-name { font-size: 34px; }
  .card-desc { font-size: 15px; }
  .card-deco-svg { width: 56px; height: 56px; }
}

@media (max-width: 1200px) {
  .grid-春 { grid-template-columns: repeat(2, 1fr); }
  .grid-夏 { grid-template-columns: repeat(2, 1fr); }
  .grid-秋 { grid-template-columns: repeat(2, 1fr); }
  .grid-冬 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .terms-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .grid-春,
  .grid-夏,
  .grid-秋,
  .grid-冬 { grid-template-columns: repeat(2, 1fr); }
  .page-content { padding: 80px 20px 40px; }
  .page-header h1 { font-size: 28px; }
}
</style>
