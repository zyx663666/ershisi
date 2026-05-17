<template>
  <div class="terms-page">
    <button class="back-btn" @click="$emit('navigate', 'home')">← 返回主页</button>
    <div class="page-content">
      <h1>节气介绍</h1>
      <div class="terms-grid">
        <div v-for="term in terms" :key="term.name" class="term-card">
          <h3>{{ term.name }}</h3>
          <p class="pinyin">{{ term.pinyin }}</p>
          <p class="date">{{ term.date }}</p>
          <p class="description">{{ term.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { terms } from '../data/terms.js'
defineEmits(['navigate'])
</script>

<style scoped>
.terms-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
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

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.term-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.term-card h3 {
  font-size: 28px;
  color: #4a3f35;
  margin: 0 0 8px 0;
}

.pinyin {
  color: #8b7355;
  font-size: 16px;
  margin: 0 0 8px 0;
}

.date {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
}

.description {
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}
</style>
