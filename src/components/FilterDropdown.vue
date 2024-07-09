<script setup lang="ts">
import FilterSwitchButton from './FilterSwitchButton.vue';
import { useRecommendationFilterStore } from '@/stores/recommendationFilterStore';

const store = useRecommendationFilterStore();
const filterState = store.filterState;


// Contains filter state info for recommendations
// 

</script>

<template>
  <div class="filter-dropdown-root">
    <span style="font-size: 1.4rem;">Filters</span>
    <div v-for="(value, key) in filterState" :key="key" class="filter-item">
      <div style="color: white; margin-top: 6px;">{{ key }}</div>
      <FilterSwitchButton
        :label="key"
        class="filter-switch-button"
      />

    </div>
  </div>
</template>

<style scoped>
.filter-dropdown-root {
  background-color: rgba(0, 0, 0, 0.667);
  padding: 20px;
  border-radius: 1rem;
}

.filter-dropdown-root span {
  color: white;
  font-size: 15px;
  font-weight: 700;
}

.filter-switch-button {
  margin-bottom: 1vh;
}
</style>