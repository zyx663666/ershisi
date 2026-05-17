<template>
  <div class="app-container">
    <HomePage v-if="currentPage === 'home'" @navigate="handleNavigate" />
    <WheelView v-else-if="currentPage === 'wheel'" />
    <SimpleCircleView v-else-if="currentPage === 'circle'" />
    <TermsView v-else-if="currentPage === 'terms'" />
    <CultureView v-else-if="currentPage === 'culture'" />
    <PoetryView v-else-if="currentPage === 'poetry'" />
    <FarmingView v-else-if="currentPage === 'farming'" />
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
</style>
