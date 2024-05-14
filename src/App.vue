<script setup lang="ts">
import { onMounted, ref } from 'vue';

import AppStarBackground from './components/AppStarBackground.vue';
import Landing from './components/Landing.vue';
import SpotifyCharts from './components/SpotifyCharts.vue';

const scrollTargetRef = ref<HTMLElement | null>(null);

const handleScroll = (): void => {
  if (scrollTargetRef.value) {
    scrollTargetRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

onMounted((): void => {
  console.log("Hello!")
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="root">
    <AppStarBackground />
    <div class="content">
      <Landing @scroll="handleScroll" />
      <section ref="scrollTargetRef">
        <SpotifyCharts />
      </section>
    </div>
  </div>
</template>

<style scoped>
.root {
  position: relative;
  min-height: var(--app-height);
}

.content {
  position: relative;
  z-index: 1;
}
</style>
