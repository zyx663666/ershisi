<template>
  <div class="farming-page">
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
        <a href="#" class="nav-link" @click.prevent="$emit('navigate', 'poetry')">诗词歌赋</a>
        <a href="#" class="nav-link active" @click.prevent="$emit('navigate', 'farming')">农事指南</a>
      </div>
    </nav>

    <div class="page-content">
      <div class="page-header">
        <div class="header-badge">农事历法</div>
        <h1>农事指南</h1>
        <div class="title-line"></div>
        <p class="header-desc">顺天应时，不违农时，千年农耕智慧</p>
      </div>

      <div class="farming-grid">
        <div
          v-for="(item, idx) in farmingItems"
          :key="item.season"
          class="farming-card"
          :style="{ animationDelay: idx * 0.12 + 's' }"
        >
          <div class="card-header" :style="{ background: item.gradient }">
            <span class="card-icon">{{ item.icon }}</span>
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
          <span class="season-icon">□</span>
          <span class="season-name">农谚智慧</span>
          <div class="season-line"></div>
        </div>
        <div class="proverb-grid">
          <div
            v-for="(proverb, idx) in proverbs"
            :key="idx"
            class="proverb-card"
            :style="{ animationDelay: idx * 0.08 + 's' }"
          >
            <span class="proverb-text">{{ proverb }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['navigate'])

const farmingItems = [
  {
    season: 'spring',
    label: '春季农事',
    icon: '◇',
    gradient: 'linear-gradient(135deg, #c9b8a8, #b8a898)',
    tasks: [
      { period: '立春-雨水', desc: '整地备耕，准备种子' },
      { period: '惊蛰-春分', desc: '播种春作物，果树修剪' },
      { period: '清明-谷雨', desc: '水稻育秧，茶园采摘' }
    ]
  },
  {
    season: 'summer',
    label: '夏季农事',
    icon: '△',
    gradient: 'linear-gradient(135deg, #9aab9e, #8d9e8f)',
    tasks: [
      { period: '立夏-小满', desc: '小麦灌浆，中耕除草' },
      { period: '芒种-夏至', desc: '抢收小麦，插秧播种' },
      { period: '小暑-大暑', desc: '田间管理，防旱防涝' }
    ]
  },
  {
    season: 'autumn',
    label: '秋季农事',
    icon: '□',
    gradient: 'linear-gradient(135deg, #c4b498, #b8a488)',
    tasks: [
      { period: '立秋-处暑', desc: '秋作物管理，防治病虫害' },
      { period: '白露-秋分', desc: '收获秋粮，播种冬小麦' },
      { period: '寒露-霜降', desc: '秋收扫尾，储藏粮食' }
    ]
  },
  {
    season: 'winter',
    label: '冬季农事',
    icon: '◯',
    gradient: 'linear-gradient(135deg, #b3bec8, #a4b0bb)',
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

.deco {
  position: fixed;
  pointer-events: none;
  z-index: 0;
}

.deco-1 {
  top: 15%;
  right: 7%;
  width: 150px;
  height: 150px;
  border: 1.5px solid rgba(139, 115, 85, 0.07);
  border-radius: 50% 0 50% 0;
  transform: rotate(25deg);
}

.deco-2 {
  bottom: 18%;
  left: 4%;
  width: 110px;
  height: 110px;
  border: 1px solid rgba(139, 115, 85, 0.05);
  border-radius: 0 50% 0 50%;
  transform: rotate(-10deg);
}

.deco-3 {
  top: 40%;
  left: 2%;
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

/* 农事卡片网格 */
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
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.03);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.farming-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border-color: rgba(255, 255, 255, 0.4);
}

.card-header {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-icon {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
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
  border-bottom: 1px solid rgba(139, 115, 85, 0.08);
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
  color: rgba(139, 115, 85, 0.6);
  white-space: nowrap;
  min-width: 80px;
  letter-spacing: 1px;
}

.task-desc {
  font-size: 14px;
  color: rgba(80, 70, 55, 0.65);
  letter-spacing: 1px;
}

/* 农谚区域 */
.proverb-section {
  animation: sectionIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

@keyframes sectionIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.season-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.season-icon {
  font-size: 14px;
  color: rgba(139, 115, 85, 0.5);
}

.season-name {
  font-size: 18px;
  font-weight: 600;
  color: rgba(80, 70, 55, 0.75);
  letter-spacing: 4px;
}

.season-line {
  flex: 1;
  height: 1px;
  background: rgba(139, 115, 85, 0.12);
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
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.proverb-card:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
}

.proverb-text {
  font-size: 14px;
  color: rgba(80, 70, 55, 0.65);
  letter-spacing: 2px;
  line-height: 1.6;
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
