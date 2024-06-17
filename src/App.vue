<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import AppStarBackground from './components/AppStarBackground.vue';
import Recommendation from './components/Recommendation.vue';


</script>

<template>
  <div class="root">
    <AppStarBackground />
    <Recommendation />
  </div>
</template>

<style scoped>
.root {
  max-width: 100vw;
  position: relative;
  max-height: 100vh;
}

.content {
  position: relative;
  z-index: 1;
}
</style>
