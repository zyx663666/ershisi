<template>
  <div class="poetry-page">
    <button class="back-btn" @click="$emit('navigate', 'home')">← 返回主页</button>
    <div class="page-content">
      <h1>诗词歌赋</h1>
      <div class="poetry-grid">
        <div class="poetry-card">
          <h3>春晓</h3>
          <p class="author">孟浩然</p>
          <p class="poem">春眠不觉晓，处处闻啼鸟。</p>
          <p class="poem">夜来风雨声，花落知多少。</p>
        </div>
        <div class="poetry-card">
          <h3>清明</h3>
          <p class="author">杜牧</p>
          <p class="poem">清明时节雨纷纷，路上行人欲断魂。</p>
          <p class="poem">借问酒家何处有，牧童遥指杏花村。</p>
        </div>
        <div class="poetry-card">
          <h3>夏至</h3>
          <p class="author">白居易</p>
          <p class="poem">昼晷已云极，宵漏自此长。</p>
          <p class="poem">未及施政教，徒增岁月忙。</p>
        </div>
        <div class="poetry-card">
          <h3>秋夕</h3>
          <p class="author">杜牧</p>
          <p class="poem">银烛秋光冷画屏，轻罗小扇扑流萤。</p>
          <p class="poem">天阶夜色凉如水，卧看牵牛织女星。</p>
        </div>
        <div class="poetry-card">
          <h3>冬至</h3>
          <p class="author">杜甫</p>
          <p class="poem">天时人事日相催，冬至阳生春又来。</p>
          <p class="poem">刺绣五纹添弱线，吹葭六琯动浮灰。</p>
        </div>
        <div class="poetry-card">
          <h3>小寒</h3>
          <p class="author">元稹</p>
          <p class="poem">小寒连大吕，欢鹊垒新巢。</p>
          <p class="poem">拾食寻河曲，衔紫绕树梢。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['navigate'])
</script>

<style scoped>
.poetry-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
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

.poetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.poetry-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.poetry-card h3 {
  font-size: 24px;
  color: #4a3f35;
  margin: 0 0 8px 0;
}

.author {
  color: #8b7355;
  font-size: 14px;
  margin: 0 0 16px 0;
}

.poem {
  color: #555;
  font-size: 16px;
  line-height: 2;
  margin: 4px 0;
}
</style>
