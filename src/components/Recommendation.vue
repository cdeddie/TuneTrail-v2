<script setup lang="ts">
import SearchSpotify from './SearchSpotify.vue';
</script>

<template>
  <div class="recommendation-root">
    <div class="title">Recommendations</div>

    <SearchSpotify />
  </div>

</template>

<style scoped>
.recommendation-root {
  min-height: 100vh;
}

.title {
  font-size: 5vw;
  font-weight: 700;
  color: rgba(43, 233, 157, 0.576);
  display: flex;
  justify-content: center;
}
</style>