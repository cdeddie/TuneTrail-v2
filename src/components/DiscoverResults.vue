<script setup lang="ts">
import { ref }                                from 'vue';
import { useDeviceStore }                     from '@/stores/deviceStore';
import RecommendationResultsListView          from './DiscoverResultsListView.vue';
import RecommendationResultsCardView          from './DiscoverResultsCardView.vue';
import MobileRecommendationResultsCardView    from './MobileDiscoverResultsCardView.vue';

defineProps<{
  recommendationData: any,
  recommendationDataLoading: boolean,
}>();

// Button logic (choose between list or card view)
const activeIndex = ref(0);
const hoveredIndex = ref<number | null>(null);

const setActive = (index: number) => {
  activeIndex.value = index;
};

const buttons = [
  { path: "M11.4919 18.3035C11.4919 19.8962 10.4636 20.4184 9.11011 19.6525L2.29858 15.7534C1.37573 15.2225 1.12085 14.7177 1.12085 13.7168V5.70109C1.12085 4.29115 2.3689 3.9169 3.36206 4.48262L4.89136 5.35295V3.51655C4.89136 2.10661 6.1394 1.72367 7.13257 2.28938L8.45972 3.05528V1.47127C8.45972 0.061334 9.70776 -0.312909 10.7009 0.252807L17.6443 4.23022C18.532 4.73502 18.8396 5.26592 18.8396 6.28421V14.0824C18.8396 15.6751 17.8025 16.1973 16.449 15.4227L15.2625 14.7438V16.119C15.2625 17.7117 14.2341 18.2339 12.8806 17.4593L11.4919 16.6673V18.3035ZM17.0027 13.7778C17.0818 13.8213 17.1433 13.7865 17.1433 13.7081V6.31902C17.1433 5.97959 17.0466 5.86645 16.783 5.70979L10.3054 2.00217C10.2263 1.95866 10.156 2.00217 10.156 2.0805V4.03005L14.0671 6.2668C14.9548 6.7803 15.2625 7.3025 15.2625 8.32079V12.7769L17.0027 13.7778ZM11.4919 10.5053V14.709L13.4343 15.8143C13.5134 15.8579 13.5662 15.8318 13.5662 15.7447V8.3556C13.5662 8.01617 13.4695 7.90303 13.2058 7.74637L6.72827 4.03875C6.64917 3.99523 6.58765 4.03875 6.58765 4.11708V6.32772L10.3054 8.45133C11.1931 8.96483 11.4919 9.49573 11.4919 10.5053ZM9.4353 9.9309L2.96655 6.23199C2.87866 6.17977 2.81714 6.22328 2.81714 6.30161V13.6559C2.81714 13.9692 2.88745 14.1085 3.15991 14.2739L9.66382 18.0076C9.74292 18.0511 9.79565 18.0163 9.79565 17.9293V10.5488C9.79565 10.2007 9.70776 10.0876 9.4353 9.9309Z" },
  { path: "M1.37397 5.74794C2.13836 5.74794 2.74794 5.13836 2.74794 4.37397C2.74794 3.61925 2.13836 3 1.37397 3C0.619255 3 0 3.61925 0 4.37397C0 5.13836 0.619255 5.74794 1.37397 5.74794ZM5.92163 5.30285H19.0614C19.5839 5.30285 20 4.89647 20 4.37397C20 3.85148 19.5936 3.44509 19.0614 3.44509H5.92163C5.4088 3.44509 4.99274 3.85148 4.99274 4.37397C4.99274 4.89647 5.39913 5.30285 5.92163 5.30285ZM1.37397 11.6986C2.13836 11.6986 2.74794 11.089 2.74794 10.3246C2.74794 9.56991 2.13836 8.95065 1.37397 8.95065C0.619255 8.95065 0 9.56991 0 10.3246C0 11.089 0.619255 11.6986 1.37397 11.6986ZM5.92163 11.2535H19.0614C19.5839 11.2535 20 10.8471 20 10.3246C20 9.80213 19.5936 9.39574 19.0614 9.39574H5.92163C5.4088 9.39574 4.99274 9.80213 4.99274 10.3246C4.99274 10.8471 5.39913 11.2535 5.92163 11.2535ZM1.37397 17.6493C2.13836 17.6493 2.74794 17.0397 2.74794 16.2753C2.74794 15.5206 2.13836 14.9013 1.37397 14.9013C0.619255 14.9013 0 15.5206 0 16.2753C0 17.0397 0.619255 17.6493 1.37397 17.6493ZM5.92163 17.2042H19.0614C19.5839 17.2042 20 16.7978 20 16.2753C20 15.7528 19.5936 15.3464 19.0614 15.3464H5.92163C5.4088 15.3464 4.99274 15.7528 4.99274 16.2753C4.99274 16.7978 5.39913 17.2042 5.92163 17.2042Z" },
];

// Mobile reactiveness
const deviceStore = useDeviceStore();
</script>

<template>
  <div class="results-root">
    <div class="results-filters">
      <div class="results-display-buttons">
        <button
          v-for="(btn, index) in buttons"
          :key="index"
          :class="{ active: activeIndex === index}"
          @click="setActive(index)"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
        >
          <svg width="20" height="20" :class="{ 'colored-svg': activeIndex === index || hoveredIndex === index }">
            <path :d="btn.path"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="results-container" v-if="!deviceStore.isMobile">
      <RecommendationResultsListView 
        class="results-list" 
        v-if="activeIndex === 1" 
        :recommendation-data="recommendationData" 
        :recommendation-data-loading="recommendationDataLoading"
      />
      <RecommendationResultsCardView 
        class="results-cards" 
        v-else-if="activeIndex === 0" 
        :recommendation-data="recommendationData" 
      />
    </div>

    <div class="mobile-results" v-else style="color: white;">
      <RecommendationResultsListView 
        class="mobile-results-list"
        v-if="activeIndex === 1" 
        :recommendation-data="recommendationData" 
        :recommendation-data-loading="recommendationDataLoading"
      />
      <MobileRecommendationResultsCardView 
        class="mobile-results-cards"
        v-else-if="activeIndex === 0"
        :recommendation-data="recommendationData"
      />
    </div>
  </div>
</template>

<style scoped>
.results-container {
  display: flex;
  flex-grow: 1;
}

.results-root {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.results-list {
  margin-left: calc(25vw + 40px);
  margin-right: 25vw;
}

.results-card {
  display: flex;
  flex-grow: 1;
  height: 100%;
}

.results-filters {
  margin-left: calc(25vw + 40px);
  margin-top: 2vh;
}

.results-display-buttons {
  margin-bottom: 10px;
}

.results-display-buttons button {
  background-color: transparent;
  border-radius: .5rem;
  border: none;
  cursor: pointer;
  padding: 5px;
  transition: background-color 0.5s ease;
  margin-right: 5px;
}

button svg {
  filter: invert(100%);
  transition: filter 0.5s ease;
}

button.active {
  background-color: white;
  border-radius: .5rem;
}

button:hover {
  background-color: white;
  border-radius: .5rem;
  transition: background-color 0.5s ease;
}

.colored-svg {
  filter: brightness(0);
}

@media (max-width: 1300px) {
  .results-list {
    margin-left: calc(8vw + 40px);
    margin-right: 17vw;
  }

  .results-filters {
    margin-left: calc(8vw + 40px);
    margin-top: 1vh;
  }
}

@media (max-width: 1050px) {
  .results-container {
    margin-bottom: 0;
  }
}

@media (max-width: 1000px) {
  .results-filters {
    margin-left: 4vw;
  }

  .results-list {
    margin-left: 4vw;
  }
}

/* ----- Mobile view ----- */

.mobile-results-list {
  margin: 0 4vw;
  display: flex;
  flex-grow: 1;
}

.mobile-results-cards {
  flex: 1;
}
</style>