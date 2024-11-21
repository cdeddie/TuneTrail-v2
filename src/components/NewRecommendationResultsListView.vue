<script setup lang="ts">
import { 
  ref, 
  watch, 
  nextTick, 
  onUnmounted, 
  computed } from 'vue';
import { truncateString }         from '@/utils/stringProcessing';
import { Skeleton }               from '@/components/ui/skeleton'
import { useRecommendationStore } from '@/stores/recommendationStore';
import { useDeviceStore }         from '@/stores/deviceStore';

const recommendationStore = useRecommendationStore();
const deviceStore = useDeviceStore();

// Intersection observer logic
const cardRefs = ref<HTMLElement[]>([]);

const observer: IntersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

watch(() => recommendationStore.currentRecommendations, () => {
  // Clear existing refs
  cardRefs.value = [];
  
  // Use nextTick to ensure the DOM has updated
  nextTick(() => {
    cardRefs.value.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });
  });
}, { immediate: true });

onUnmounted(() => {
  observer.disconnect();
});

const truncateLength = computed(() => {
  if (deviceStore.width < 480) {
    return 25;
  } else {
    return 70;
  }
});
</script>

<template>
  <div class="list-view">
    <div v-if="recommendationStore.recommendationDataLoading">
      <div class="skeleton-container" v-for="index in 25" :key="index">
        <Skeleton class="skeleton skeleton-album"/>
        <div class="skeleton-details">
          <Skeleton class="skeleton skeleton-title"/>
          <Skeleton class="skeleton skeleton-subtitle"/>
        </div>
      </div>
    </div>
    
    <div 
      class="results-loaded" 
      v-else-if="recommendationStore.currentRecommendations !== undefined 
      && !Array.isArray(recommendationStore.currentRecommendations)"
    >
      <a
        class="result-card" 
        v-for="(track, index) in recommendationStore.currentRecommendations.tracks"
        :key="track.id"
        :ref="(el) => { if (el) cardRefs[index] = el as HTMLElement }"
        :href="track.external_urls.spotify"
        target="_blank"
      >
        <img :src="track.album.images[1]?.url" class="card-img">
        <div class="card-info">
          <span class="result-title">{{ truncateString(track.name, truncateLength) }}</span>
          <span class="result-subtitle">
            <i 
              v-if="track.explicit"
              class="bi bi-explicit-fill"
              style="margin-right: 2px;"
            ></i>
            {{ truncateString(track.artists[0].name, 35) }}
          </span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.list-view {
  display: flex;
  flex-direction: column;
  margin-left: calc(var(--search-element-left));
  width: 45vw;
}

.skeleton {
  background-color: rgba(168, 168, 168, 0.55);
}

.skeleton-container {
  display: flex;
  flex-direction: row;
}

.skeleton-album {
  height: 80px;
  width: 80px;
  margin-bottom: 8px;
}

.skeleton-details {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
  margin-bottom: 8px;
  margin-top: auto;
}

.skeleton-title {
  height: 20px;
  width: 200px;
}

.skeleton-subtitle {
  height: 20px;
  width: 70px;
  margin-top: 3px;
}

.result-card {
  display: flex;
  flex-direction: row;
  padding: 4px 0;
  box-sizing: border-box;
  align-items: center;
  min-height: 90px;
  
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease, transform 0.5s ease, background-color .3s ease;
}

.result-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.result-card:hover {
  background-color: rgba(72, 72, 72, 0.279);
  cursor: pointer;
}

.result-card:hover .card-img {
  transform: scale(1.135);
}

.result-card:last-child {
  margin-bottom: 10px;
}

.card-img {
  height: 80px;
  border-radius: .2rem;
  transition: transform 0.3s ease;
}

.card-info {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-left: 16px;
  color: white;
}

.result-title {
  font-weight: 700;
  font-size: 1.3rem;
  color: white;
}

.result-subtitle {
  font-size: 1rem;
  font-weight: 550;
  color: #d8d8d8;
}

@media (max-width: 1400px) {
  .list-view {
    width: 55vw;
  }

  .result-title {
    font-size: 1.2rem;
  }

  .result-subtitle {
    font-size: .9rem;
  }
}

@media (max-width: 480px) {
  .list-view {
    width: 95vw;
  }
}
</style>