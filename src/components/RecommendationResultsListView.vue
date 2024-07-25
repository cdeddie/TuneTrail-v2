<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted }  from 'vue';
import { truncateString }                     from '@/utils/stringProcessing';
import { Skeleton }                           from '@/components/ui/skeleton'

const props = defineProps<{
  recommendationData: any,
  recommendationDataLoading: boolean,
}>();

// Intersection observer logic
const cardRefs = ref<HTMLElement[]>([]);

watch(() => props.recommendationData, () => {
  cardRefs.value = [];
});

const observer: IntersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

watch(() => props.recommendationData, () => {
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
</script>

<template>
  <div class="list-view">
    <div class="skeleton-container" v-for="index in 25" :key="index" v-if="recommendationDataLoading">
      <Skeleton class="skeleton skeleton-album"/>
      <div class="skeleton-details">
        <Skeleton class="skeleton skeleton-title"/>
        <Skeleton class="skeleton skeleton-subtitle"/>
      </div>
    </div>
    <div class="results-loaded" v-else-if="recommendationData">
      <a
        class="result-card" 
        v-for="(track, index) in recommendationData?.tracks"
        :key="track.id"
        :ref="(el) => { if (el) cardRefs[index] = el as HTMLElement }"
        :href="track.external_urls.spotify"
        target="_blank"
      >
        <img :src="track.album.images[1]?.url" class="card-img">
        <div class="card-info">
          <span class="result-title">{{ track.name }}</span>
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
  padding: 5px 0;
  align-items: center;
  background-clip: content-box;
  min-height: 90px;
  
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.result-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.result-card:hover {
  transform: scale(1.01);
  cursor: pointer;
}

.result-card:first-child {
  padding-top: 10px;
}

.result-card:last-child {
  padding-bottom: 10px;
}

.card-img {
  height: 80px;
  border-radius: .2rem;
}

.card-info {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-left: 10px;
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
  color: #c1c1c1;
}

@media (max-width: 1300px) {
  .results-root {
    margin-left: 21vw;
    margin-right: 17vw;
  }

  .result-title {
    font-size: 1.2rem;
  }

  .result-subtitle {
    font-size: .9rem;
  }
}

@media (max-width: 1000px) {

}
</style>