<template>
  <!-- 页面容器：深色背景居中展示 -->
  <div class="circle-page">
    <!-- 顺时针旋转的圆 -->
    <RotatingCircle
      :size="300"
      :borderWidth="6"
      borderColor="#d4a84b"
      :duration="6"
    />
  </div>
</template>

<script setup>
/**
 * 简单圆页面
 * 展示一个居中顺时针旋转的圆
 */
import RotatingCircle from './RotatingCircle.vue'
</script>

<style scoped>
.circle-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Noto Serif SC', serif;
}
</style>
