<script setup lang="ts">
import AppStarBackground from './components/AppStarBackground.vue';
import Recommendation from './components/Recommendation.vue';


</script>

<template>
  <div class="root">
    <!-- <AppStarBackground /> -->
    <Recommendation />
  </div>
</template>

<style scoped>
.root {
  max-width: 100vw;
  position: relative;
  max-height: 100vh;
  background: rgb(45, 40, 62);
  background: linear-gradient(to bottom right, #22202f, #201c2e 50%, #15121d);
}
</style>
