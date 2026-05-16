<template>
  <!-- 顺时针旋转的圆容器 -->
  <div
    class="rotating-circle"
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderWidth: borderWidth + 'px',
      borderColor: borderColor,
      animationDuration: duration + 's'
    }"
  ></div>
</template>

<script setup>
/**
 * 顺时针旋转的圆组件
 * 使用 CSS animation 实现连续顺时针旋转
 */
defineProps({
  size: {
    type: Number,
    default: 200
  },
  borderWidth: {
    type: Number,
    default: 4
  },
  borderColor: {
    type: String,
    default: '#8b7355'
  },
  duration: {
    type: Number,
    default: 8
  }
})
</script>

<style scoped>
.rotating-circle {
  border-radius: 50%;
  border-style: solid;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  animation: rotateclockwise linear infinite;
}

@keyframes rotateclockwise {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
