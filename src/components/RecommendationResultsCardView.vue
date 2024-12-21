<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted } from 'vue';

import { useRecommendationStore }   from '@/stores/recommendationStore';
import { useLocalSettingsStore }    from '@/stores/localSettingsStore';

import Swiper               from 'swiper';
import { EffectCoverflow }  from 'swiper/modules';

import { getProminentColour } from '@/utils/colourStyle';

import LoadingSpinner         from './LoadingSpinner.vue';
import MusicPlayerCard        from './MusicPlayerCard.vue';
import MusicPlayerInfo        from './MusicPlayerInfo.vue';
import MusicPlayerControls    from './MusicPlayerControls.vue';

/* 
RecommendationResultsCardView
  - Swiper instance
  - Swiper frontend
MusicPlayerFlow
  - MusicPlayerInfo
  - MusicPlayerControls
*/

// Pinia stores
const recommendationStore = useRecommendationStore();
const localSettingsStore = useLocalSettingsStore();

const tracks = computed(() => {
  const recommendations = recommendationStore.currentRecommendations;
  if (!recommendations) return [];

  const tracks = recommendations.tracks;
  if (localSettingsStore.excludeNullPreview) {
    return tracks.filter((track) => track.preview_url != null);
  }
  return tracks;
});

// Two watchers same thing, just second is for refreshing recs
watch(tracks, () => {
  updateCurrentValues();
});

watch(() => recommendationStore.recommendationDataLoading, async(isLoading) => {
  if (!isLoading) {
    await nextTick();
    updateCurrentValues();
    updateBackgroundColour();
  }
});

// Swiper logic
const swiper = ref<Swiper>();
const currentTrackIndex = ref<number>(0);
const currentTrack = ref<SpotifyApi.RecommendationTrackObject>();

// Init function for the swiper
const initializeSwiper = (): void => {
  swiper.value = new Swiper('.swiper', {
    modules: [EffectCoverflow],
    effect: 'coverflow',
    rewind: true,
    observer: true,
    centeredSlides: true,
    initialSlide: currentTrackIndex.value,
    slidesPerView: 'auto',
    allowTouchMove: true,
    spaceBetween: 40,
    coverflowEffect: {
      rotate: 30,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  swiper.value.on('afterInit', () => {
    updateCurrentValues();
  });

  swiper.value.on('slideChange', () => {
    // Need to set the current track index to the active index of the swiper
    updateCurrentValues();
    // If isPlaying bool, then play the audio
    updateBackgroundColour();
  });
};

const updateCurrentValues = () => {
  if (swiper.value) {
    currentTrackIndex.value = swiper.value.activeIndex;
    currentTrack.value = tracks.value[currentTrackIndex.value];
  }
};

onMounted(() => {
  initializeSwiper();
  updateCurrentValues();
  updateBackgroundColour();
});

// Root background current track prominent colour logic
const backgroundColour = ref<string>('');

const updateBackgroundColour = async () => {
  if (!currentTrack.value) return;

  try {
    const imgUrl = currentTrack.value.album.images[0]?.url;
    backgroundColour.value = await getProminentColour(imgUrl);

    if (!localSettingsStore.preserveBG) {
      // Update the background colour in the store and CSS variable
      localSettingsStore.backgroundColour = backgroundColour.value;
      document.documentElement.style.setProperty('--bg', backgroundColour.value);
    }
  } catch (error) {
    console.error('Error extracting prominent color:', error);
    backgroundColour.value = 'transparent';
  }
};

// For weird laggy stuff when switching category
const categoryLoading = ref<boolean>(false);

watch(() => recommendationStore.activeCategory, async (newValue) => {
  categoryLoading.value = true;
  setTimeout(async() => {
    categoryLoading.value = false;
    if (newValue) {
      await nextTick();
      if (swiper.value) {
        swiper.value.destroy();
      }
      currentTrackIndex.value = 0;
      initializeSwiper();
      updateBackgroundColour();
    }
  }, 250);
});

// Updating the swiper instance with new recommendations
watch(() => recommendationStore.currentRecommendations, async (newValue) => {
  if (newValue) {
    currentTrack.value = newValue.tracks[0];
    await nextTick();
    if (swiper.value) {
      swiper.value.destroy();
    }
    currentTrackIndex.value = 0;
    initializeSwiper();
    updateBackgroundColour();
  }
});

</script>

<template>
  <div class="card-view-root">
    <div v-if="categoryLoading || recommendationStore.recommendationDataLoading">
      <LoadingSpinner :use-colors="false" />
    </div>

    <div v-else class="swiper-loaded">
      <div class="album-cover" v-if="tracks.length">
        <div class="swiper">
          <div class="swiper-wrapper">
            <div v-for="(track) in tracks" :key="track.id" class="swiper-slide">
              <MusicPlayerCard :current-track="track" :modal-enabled="currentTrack?.id === track.id" />
            </div>
          </div>
        </div>
      </div>

      <div class="card-view-flow" v-if="recommendationStore.currentRecommendations">
        <MusicPlayerInfo :current-track="currentTrack" />
        <MusicPlayerControls :current-track="currentTrack" :swiper="swiper" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  width: 100vw;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.card-view-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.swiper-loaded {
  position: relative;
  margin: 20px 0;
}

.album-cover {
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  max-width: 98vw;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}

.swiper-slide {
  position: relative;
  max-width: 20vw;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-view-flow {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>