<script setup>
import { onMounted } from 'vue';

import GlobalChartContainer from './GlobalChartContainer.vue';

onMounted(() => {

});
</script>

<template>
  <div class="charts-root">
    <div class="title">What's Charting?</div>
    <GlobalChartContainer />

  </div>
</template>

<style scoped>
section {
  display: grid;
  place-items: center;
  align-content: center;
  font-size: 30px;
  font-weight: 700;
  color: white;
}

.charts-root {
  display: flex;
  flex-direction: column;
  min-height: 400vh;
}

.title {
  font-size: 5vw;
  font-weight: 750;
  color: rgba(211, 233, 224, 0.576);
  margin-left: auto;
  margin-right: auto;
}
</style>