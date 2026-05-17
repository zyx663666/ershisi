<template>
  <div class="home-page">
    <div class="home-header">
      <h1 class="home-title">二十四节气</h1>
      <p class="home-subtitle">探索中国传统节气文化</p>
    </div>
    <div class="button-grid">
      <button class="nav-button" @click="navigateTo('wheel')">
        <span class="button-icon">🌸</span>
        <span class="button-text">节气轮盘</span>
        <span class="button-desc">24节气圆形展示</span>
      </button>
      <button class="nav-button" @click="navigateTo('circle')">
        <span class="button-icon"></span>
        <span class="button-text">旋转圆</span>
        <span class="button-desc">简约旋转动画</span>
      </button>
      <button class="nav-button" @click="navigateTo('terms')">
        <span class="button-icon"></span>
        <span class="button-text">节气介绍</span>
        <span class="button-desc">详细节气知识</span>
      </button>
      <button class="nav-button" @click="navigateTo('culture')">
        <span class="button-icon"></span>
        <span class="button-text">传统文化</span>
        <span class="button-desc">节气相关习俗</span>
      </button>
      <button class="nav-button" @click="navigateTo('poetry')">
        <span class="button-icon">📝</span>
        <span class="button-text">诗词歌赋</span>
        <span class="button-desc">节气相关诗词</span>
      </button>
      <button class="nav-button" @click="navigateTo('farming')">
        <span class="button-icon">🌾</span>
        <span class="button-text">农事指南</span>
        <span class="button-desc">节气农事活动</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['navigate'])

const navigateTo = (page) => {
  emit('navigate', page)
}
</script>

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Serif SC', serif;
  padding: 40px;
  box-sizing: border-box;
}

.home-header {
  text-align: center;
  margin-bottom: 60px;
}

.home-title {
  font-size: 56px;
  color: #fff;
  margin: 0 0 16px 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 8px;
}

.home-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  letter-spacing: 4px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 900px;
  width: 100%;
}

.nav-button {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 20px;
  padding: 30px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.nav-button:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
  background: #fff;
}

.button-icon {
  font-size: 40px;
}

.button-text {
  font-size: 20px;
  font-weight: 700;
  color: #4a3f35;
  font-family: 'Noto Serif SC', serif;
}

.button-desc {
  font-size: 14px;
  color: #888;
}

@media (max-width: 768px) {
  .button-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .home-title {
    font-size: 36px;
  }
  
  .home-subtitle {
    font-size: 16px;
  }
}
</style>
