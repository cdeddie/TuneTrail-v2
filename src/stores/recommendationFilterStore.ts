import { defineStore } from 'pinia';
import { RecommendationFilter } from '@/types/RecommendationType';
import { reactive } from 'vue';

export const useRecommendationFilterStore = defineStore('RecommendationFilterStore', () => {
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
  };

  return {
    filterState,
    updateFilterValue
  }
});