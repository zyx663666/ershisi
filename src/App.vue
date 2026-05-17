<template>
  <div class="app-container">
    <Transition name="page-fade" mode="out-in">
      <HomePage v-if="currentPage === 'home'" @navigate="handleNavigate" />
      <WheelView v-else-if="currentPage === 'wheel'" @navigate="handleNavigate" />
      <SimpleCircleView v-else-if="currentPage === 'circle'" @navigate="handleNavigate" />
      <TermsView v-else-if="currentPage === 'terms'" @navigate="handleNavigate" />
      <CultureView v-else-if="currentPage === 'culture'" @navigate="handleNavigate" />
      <PoetryView v-else-if="currentPage === 'poetry'" @navigate="handleNavigate" />
      <FarmingView v-else-if="currentPage === 'farming'" @navigate="handleNavigate" />
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HomePage from './components/HomePage.vue'
import WheelView from './components/WheelView.vue'
import SimpleCircleView from './components/SimpleCircleView.vue'
import TermsView from './components/TermsView.vue'
import CultureView from './components/CultureView.vue'
import PoetryView from './components/PoetryView.vue'
import FarmingView from './components/FarmingView.vue'

const currentPage = ref('home')

const handleNavigate = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 页面切换淡入淡出过渡动画 */
.page-fade-enter-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: scale(0.98) translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: scale(1.01) translateY(-4px);
}
</style>
