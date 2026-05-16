<template>
  <!-- 根组件，支持页面切换 -->
  <div class="app-container">
    <!-- 页面切换按钮 -->
    <div class="page-switcher">
      <button
        :class="{ active: currentPage === 'wheel' }"
        @click="currentPage = 'wheel'"
      >
        节气轮盘
      </button>
      <button
        :class="{ active: currentPage === 'circle' }"
        @click="currentPage = 'circle'"
      >
        旋转圆
      </button>
    </div>

    <!-- 根据当前页面渲染对应组件 -->
    <WheelView v-if="currentPage === 'wheel'" />
    <SimpleCircleView v-else />
  </div>
</template>

<script setup>
/**
 * 根组件
 * 支持节气轮盘页面和旋转圆页面切换
 */
import { ref } from 'vue'
import WheelView from './components/WheelView.vue'
import SimpleCircleView from './components/SimpleCircleView.vue'

// 当前页面：'wheel' 或 'circle'
const currentPage = ref('wheel')
</script>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.page-switcher {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.page-switcher button {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background: transparent;
  color: #666;
  font-family: 'Noto Serif SC', serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-switcher button:hover {
  background: #f0f0f0;
}

.page-switcher button.active {
  background: #8b7355;
  color: white;
}
</style>
