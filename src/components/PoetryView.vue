<template>
  <div class="poetry-page">
    <!-- 装饰性几何元素 -->
    <div class="deco deco-1"></div>
    <div class="deco deco-2"></div>
    <div class="deco deco-3"></div>

    <!-- 顶部导航栏 -->
    <nav class="top-nav">
      <div class="nav-logo" @click="$emit('navigate', 'home')">
        <span class="logo-icon">◇</span>
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
        <div class="title-line"></div>
        <p class="header-desc">千年诗韵映节气，一字一句皆风华</p>
      </div>

      <div class="poetry-grid">
        <div
          v-for="(poem, idx) in poems"
          :key="poem.title"
          class="poetry-card"
          :style="{ animationDelay: idx * 0.1 + 's' }"
        >
          <div class="poem-header">
            <div class="poem-season-dot" :style="{ background: poem.dotColor }"></div>
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
defineEmits(['navigate'])

const poems = [
  {
    title: '春晓',
    author: '孟浩然',
    season: '春',
    dotColor: '#c9b8a8',
    lines: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'],
    note: '惊蛰时节，春意渐浓'
  },
  {
    title: '清明',
    author: '杜牧',
    season: '春',
    dotColor: '#c9b8a8',
    lines: ['清明时节雨纷纷，路上行人欲断魂。', '借问酒家何处有，牧童遥指杏花村。'],
    note: '清明时节，烟雨江南'
  },
  {
    title: '夏至避暑北池',
    author: '韦应物',
    season: '夏',
    dotColor: '#9aab9e',
    lines: ['昼晷已云极，宵漏自此长。', '绿筠尚含粉，圆荷始散芳。'],
    note: '夏至日长，荷风送香'
  },
  {
    title: '秋夕',
    author: '杜牧',
    season: '秋',
    dotColor: '#c4b498',
    lines: ['银烛秋光冷画屏，轻罗小扇扑流萤。', '天阶夜色凉如水，卧看牵牛织女星。'],
    note: '秋分时节，天高气爽'
  },
  {
    title: '冬至',
    author: '杜甫',
    season: '冬',
    dotColor: '#b3bec8',
    lines: ['天时人事日相催，冬至阳生春又来。', '刺绣五纹添弱线，吹葭六琯动浮灰。'],
    note: '冬至阳生，数九寒天'
  },
  {
    title: '小寒',
    author: '元稹',
    season: '冬',
    dotColor: '#b3bec8',
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

.deco {
  position: fixed;
  pointer-events: none;
  z-index: 0;
}

.deco-1 {
  top: 10%;
  right: 5%;
  width: 180px;
  height: 180px;
  border: 1.5px solid rgba(139, 115, 85, 0.06);
  border-radius: 50% 0 50% 0;
  transform: rotate(15deg);
}

.deco-2 {
  bottom: 12%;
  left: 5%;
  width: 130px;
  height: 130px;
  border: 1px solid rgba(139, 115, 85, 0.05);
  border-radius: 0 50% 0 50%;
  transform: rotate(-20deg);
}

.deco-3 {
  top: 55%;
  right: 4%;
  width: 70px;
  height: 70px;
  border: 1px solid rgba(139, 115, 85, 0.04);
  border-radius: 50%;
}

.top-nav {
  position: fixed;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 52px;
  background: rgba(180, 170, 155, 0.15);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border-radius: 26px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-right: 28px;
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.nav-logo:hover {
  opacity: 0.7;
}

.logo-icon {
  font-size: 18px;
  color: rgba(100, 90, 75, 0.7);
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
  color: rgba(80, 70, 55, 0.55);
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 18px;
  font-size: 13px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  letter-spacing: 1px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(80, 70, 55, 0.85);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(80, 70, 55, 0.9);
  font-weight: 600;
}

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
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-badge {
  display: inline-block;
  font-size: 11px;
  color: rgba(139, 115, 85, 0.6);
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  padding: 4px 16px;
  border-radius: 10px;
  letter-spacing: 3px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  background: rgba(139, 115, 85, 0.25);
  margin: 0 auto 14px;
  border-radius: 1px;
}

.header-desc {
  font-size: 14px;
  color: rgba(100, 90, 75, 0.5);
  letter-spacing: 2px;
  margin: 0;
}

/* 诗词卡片网格 */
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
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.03);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.poetry-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border-color: rgba(255, 255, 255, 0.4);
}

.poem-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.poem-season-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
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
}

.poem-divider {
  width: 30px;
  height: 1px;
  background: rgba(139, 115, 85, 0.15);
  margin: 0 0 12px;
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
