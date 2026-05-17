<template>
  <div class="farming-page">
    <button class="back-btn" @click="$emit('navigate', 'home')">← 返回主页</button>
    <div class="page-content">
      <h1>农事指南</h1>
      <div class="farming-grid">
        <div class="farming-card">
          <h3>🌱 春季农事</h3>
          <ul>
            <li><strong>立春-雨水：</strong>整地备耕，准备种子</li>
            <li><strong>惊蛰-春分：</strong>播种春作物，果树修剪</li>
            <li><strong>清明-谷雨：</strong>水稻育秧，茶园采摘</li>
          </ul>
        </div>
        <div class="farming-card">
          <h3>☀️ 夏季农事</h3>
          <ul>
            <li><strong>立夏-小满：</strong>小麦灌浆，中耕除草</li>
            <li><strong>芒种-夏至：</strong>抢收小麦，插秧播种</li>
            <li><strong>小暑-大暑：</strong>田间管理，防旱防涝</li>
          </ul>
        </div>
        <div class="farming-card">
          <h3> 秋季农事</h3>
          <ul>
            <li><strong>立秋-处暑：</strong>秋作物管理，防治病虫害</li>
            <li><strong>白露-秋分：</strong>收获秋粮，播种冬小麦</li>
            <li><strong>寒露-霜降：</strong>秋收扫尾，储藏粮食</li>
          </ul>
        </div>
        <div class="farming-card">
          <h3>❄️ 冬季农事</h3>
          <ul>
            <li><strong>立冬-小雪：</strong>农田水利建设，积肥</li>
            <li><strong>大雪-冬至：</strong>温室管理，果树防寒</li>
            <li><strong>小寒-大寒：</strong>总结规划，修整农具</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['navigate'])
</script>

<style scoped>
.farming-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
  overflow-y: auto;
  padding: 80px 40px 40px;
  box-sizing: border-box;
  font-family: 'Noto Serif SC', serif;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Noto Serif SC', serif;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-content h1 {
  text-align: center;
  font-size: 42px;
  color: #4a3f35;
  margin-bottom: 40px;
}

.farming-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.farming-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.farming-card h3 {
  font-size: 22px;
  color: #4a3f35;
  margin: 0 0 16px 0;
}

.farming-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.farming-card li {
  color: #555;
  font-size: 14px;
  line-height: 1.8;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.farming-card li:last-child {
  border-bottom: none;
}

.farming-card strong {
  color: #4a3f35;
}
</style>
