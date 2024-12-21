<script setup lang="ts">
import MobileDiscoverResultsCardView from './MobileDiscoverResultsCardView.vue';
import RecommendationResultsCardView from './RecommendationResultsCardView.vue';
import NewRecommendationResultsListView from './NewRecommendationResultsListView.vue';
import { useDeviceStore } from '@/stores/deviceStore';

const deviceStore = useDeviceStore();
const props = defineProps<{
  activeIndex: number,
}>();
</script>

<template>
  <div class="results-container" v-if="!deviceStore.isMobile">
    <div v-if="props.activeIndex === 1">
      <NewRecommendationResultsListView />
    </div>
    <div class="card-dt" v-else-if="props.activeIndex === 0">
      <RecommendationResultsCardView />
    </div>
  </div>

  <div class="mobile-results" v-else style="color: white;">
    <div v-if="props.activeIndex === 1">
      <NewRecommendationResultsListView />
    </div>
    <div v-else>
      <MobileDiscoverResultsCardView />
    </div>
  </div>
</template>

<style scoped>
.results-container {
  display: flex;
  flex-grow: 1;
}

.card-dt {
  flex-grow: 1;
}
</style>