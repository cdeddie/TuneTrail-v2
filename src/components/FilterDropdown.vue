<script setup lang="ts">
import { ref, reactive } from 'vue';
import FilterSwitchButton from './FilterSwitchButton.vue';
import { RecommendationFilter } from '@/types/recommendationType';

const emit = defineEmits<{
  (event: 'filter-update', state: RecommendationFilter): void
}>();

const emitFilterState = () => {
  emit('filter-update', { ...filterState });
};

const filterOptions = [
  { label: 'Popularity', key: 'popularity' },
  { label: 'Energy', key: 'energy' },
  { label: 'Happiness', key: 'happiness' },
  { label: 'Danceability', key: 'danceability' },
];

const filterState = reactive<RecommendationFilter>({
  popularity: null,
  energy: null,
  happiness: null,
  danceability: null,
});

const updateFilterValue = (key: keyof RecommendationFilter, value: string | null) => {
  if (value === 'High') {
    filterState[key] = 80;
  } else if (value === 'Low') {
    filterState[key] = 20;
  } else {
    filterState[key] = null;
  }
  emitFilterState();
};
</script>

<template>
  <div class="filter-dropdown-root">
    <span style="font-size: 1.4rem;">Filters</span>
    <div v-for="option in filterOptions" :key="option.key" class="filter-item">
      <span>{{ option.label }}</span>
      <FilterSwitchButton 
        :left="'High'" 
        :right="'Low'" 
        @update-active-value="(value) => updateFilterValue(option.key, value)"
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
  font-weight: 600;
}

.filter-switch-button {
  margin-bottom: 1vh;
}

</style>