<script setup lang="ts">
import { RecommendationFilter }         from '@/types/RecommendationType';
import FilterSwitchButton               from './FilterSwitchButton.vue';
import { useRecommendationFilterStore } from '@/stores/recommendationFilterStore';

// Contains filter state info for recommendations

const store = useRecommendationFilterStore();
const filterState = store.filterState;

const capitalizeFirstLetter = (key: keyof RecommendationFilter): string => {
  const str = key as string;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<template>
  <div class="filter-dropdown-root">
    <div class="background">
      <span style="font-size: 1.4rem;">Filters</span>
      <div v-for="(value, key) in filterState" :key="key" class="filter-item">
        <div style="color: white; margin-top: 6px;">{{ capitalizeFirstLetter(key) }}</div>
        <FilterSwitchButton
          :label="key"
          class="filter-switch-button"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-dropdown-root {
  background-color: rgb(37, 37, 37);
  border-radius: .95rem;
  padding: 7px;
}

.background {
  background-color: rgba(0, 0, 0, 0.667);
  padding: 20px;
  border-radius: .9rem;
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