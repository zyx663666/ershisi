<template>
  <div class="culture-page">
    <button class="back-btn" @click="$emit('navigate', 'home')">← 返回主页</button>
    <div class="page-content">
      <h1>传统文化</h1>
      <div class="content-grid">
        <div class="content-card">
          <h3>节气饮食</h3>
          <p>每个节气都有对应的传统美食，如立春吃春饼、冬至吃饺子等。</p>
        </div>
        <div class="content-card">
          <h3>节气习俗</h3>
          <p>清明扫墓、端午赛龙舟、中秋赏月，节气承载着丰富的民俗文化。</p>
        </div>
        <div class="content-card">
          <h3>养生之道</h3>
          <p>顺应节气变化调整作息和饮食，是中华传统养生的重要理念。</p>
        </div>
        <div class="content-card">
          <h3>节气服饰</h3>
          <p>古人根据节气变化更换衣物，体现了人与自然和谐共处的智慧。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['navigate'])
</script>

<style scoped>
.culture-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
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

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.content-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.content-card h3 {
  font-size: 22px;
  color: #4a3f35;
  margin: 0 0 12px 0;
}

.content-card p {
  color: #555;
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
}
</style>
