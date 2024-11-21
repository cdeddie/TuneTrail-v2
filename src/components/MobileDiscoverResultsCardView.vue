<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { getProminentColour } from '@/types/TagType';
import { darkOrLightFont } from '@/utils/colourStyle';
import Swiper                                                       from 'swiper';
import { EffectCoverflow }                                          from 'swiper/modules';
import { useLocalSettingsStore } from '@/stores/localSettingsStore';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { truncateString } from '@/utils/stringProcessing';
import LoadingSpinner from './LoadingSpinner.vue';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const recommendationStore = useRecommendationStore();
const localSettingsStore = useLocalSettingsStore();

const isPlaying = ref<boolean>(false);
const currentTrackIndex = ref<number>(0);

const tracks = computed(() => {
  if (
    recommendationStore.currentRecommendations != undefined && !Array.isArray(recommendationStore.currentRecommendations)
  ) {
    if (localSettingsStore.excludeNullPreview) {
      let data = [];
      for (let i = 0; i < recommendationStore.currentRecommendations.tracks.length; i++) {
        if (data.length === 25) break;
        const curr = recommendationStore.currentRecommendations.tracks[i];
        if (curr.preview_url) {
          data.push(curr);
        }
      }
      return data;
    } else {
      return recommendationStore.currentRecommendations.tracks;
    }
  } else {
    return [];
  }
});

const currentTrack = computed(() => (tracks.value.length ? tracks.value[currentTrackIndex.value] : null));

const audioPlayer = ref<HTMLAudioElement | null>(null);
const currentTime = ref(0);
const TOTAL_DURATION = 30;

const progressValue = computed(() => Math.round(currentTime.value * 10));

const playPause = () => {
  if (audioPlayer.value) {
    if (isPlaying.value) {
      audioPlayer.value.pause();
      isPlaying.value = false;
    } else {
      audioPlayer.value.play();
      isPlaying.value = true;
    }
  }
};

const onTimeUpdate = () => {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime;
  }
};

const onProgressInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (audioPlayer.value) {
    const value = Number(target.value);
    const time = value / 10;
    currentTime.value = time;
    audioPlayer.value.currentTime = time;
  }
};

const onEnded = () => {
  currentTime.value = TOTAL_DURATION;
  isPlaying.value = false;
};

const playNextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.value.length;
  swiper.slideNext();
  if (isPlaying.value) playPause();
};

const playPreviousTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.value.length) % tracks.value.length;
  swiper.slidePrev();
  if (isPlaying.value) playPause();
};

// Swiper Instance
let swiper: Swiper;

// Initialize Swiper on Mounted
onMounted(() => {
  initializeSwiper();
  updateBackgroundColour();
});

// Initialize Swiper Function
const initializeSwiper = (): void => {
  swiper = new Swiper('.swiper', {
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
      rotate: 25,
      stretch: 0,
      depth: 50,
      modifier: 1,
      slideShadows: false,
    },
    navigation: {
      nextEl: '.forward',
      prevEl: '.backward',
    },
  });

  swiper.on('slideChange', () => {
    currentTrackIndex.value = swiper.activeIndex;
    if (isPlaying.value) {
      playPause();
    }
  });
};

// // Watch for Recommendations Change to Reinitialize Swiper
watch(() => recommendationStore.currentRecommendations, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (swiper) {
      swiper.destroy(true, true);
    }
    currentTrackIndex.value = 0;
    initializeSwiper();
    if (isPlaying.value) playPause();
    updateBackgroundColour();
  }
});

// Background Color Logic
const backgroundColour = ref<string>('');

const updateBackgroundColour = async () => {
  if (!currentTrack.value) return;

  try {
    const imgUrl = currentTrack.value.album.images[0]?.url;
    backgroundColour.value = await getProminentColour(imgUrl);

    if (!localSettingsStore.preserveBG) {
      localSettingsStore.backgroundColour = backgroundColour.value;
      document.documentElement.style.setProperty('--bg', backgroundColour.value);
    }
  } catch (error) {
    console.error('Error extracting prominent color:', error);
    backgroundColour.value = 'transparent';
  }
};

watch(() => localSettingsStore.preserveBG, (newValue) => {
  if (!newValue) {
    localSettingsStore.backgroundColour = backgroundColour.value;
    document.documentElement.style.setProperty('--bg', backgroundColour.value);
  }
});

onMounted(() => {
  updateBackgroundColour();
});

watch(currentTrack, () => {
  updateBackgroundColour();
});
</script>


<template>
  <div
    class="mobile-card-view"
    v-if="!recommendationStore.recommendationDataLoading && recommendationStore.currentRecommendations"
  >
    <!-- Swiper Carousel -->
    <div class="swiper">
      <div class="swiper-wrapper">
        <div v-for="(track) in tracks" :key="track.id" class="swiper-slide">
          <img :src="track.album.images[0]?.url" alt="Album Cover" />
          <div class="overlay">
            <a :href="track.external_urls.spotify" target="_blank" rel="noopener noreferrer"></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Music Player Controls -->
    <div class="mobile-player">
      <!-- Track Information -->
      <div class="track-info" v-if="currentTrack">
        <h2 :class="{ 'track-name-dark': darkOrLightFont(backgroundColour) }">
          <a :href="currentTrack?.uri" target="_blank" rel="noopener noreferrer">
            {{ truncateString(currentTrack.name, 32) }}
          </a>
        </h2>
        <p>
          <span v-for="(artist, index) in currentTrack?.artists" :key="artist.id">
            <a
              class="track-artist"
              :class="{ 'track-artist-dark': darkOrLightFont(backgroundColour) }"
              :href="artist.uri"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ artist.name }}
            </a>
            <span
              class="track-artist"
              :class="{ 'track-artist-dark': darkOrLightFont(backgroundColour) }"
              v-if="index < currentTrack.artists.length - 1"
            >
              ,
            </span>
          </span>
        </p>
      </div>

      <!-- Playback Controls -->
      <div class="controls">
        <button class="backward" @click="playPreviousTrack" aria-label="Previous Track">
          <img src="@/assets/backward.svg" :class="{ 'svg-dark': darkOrLightFont(backgroundColour) }" alt="Previous" />
        </button>

        <button
          class="play-pause-btn"
          :class="{ 'disabled': !currentTrack?.preview_url, 'svg-dark': darkOrLightFont(backgroundColour) }"
          :disabled="!currentTrack?.preview_url"
          @click="playPause"
          aria-label="Play/Pause"
        >
          <i
            :class="[
              'bi',
              isPlaying ? 'bi-pause-circle-fill' : 'bi-play-circle-fill',
              { 'bi-play-circle-fill': !currentTrack?.preview_url },
            ]"
            id="controlIcon"
          ></i>
        </button>

        <button class="forward" @click="playNextTrack" aria-label="Next Track">
          <img src="@/assets/forward.svg" :class="{ 'svg-dark': darkOrLightFont(backgroundColour) }" alt="Next" />
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="progress-container">
        <input
          id="progress"
          :class="{ 'disabled': !currentTrack?.preview_url, 'progress-dark': darkOrLightFont(backgroundColour) }"
          type="range"
          :min="0"
          :max="300"
          :step="1"
          :value="progressValue"
          :disabled="!currentTrack?.preview_url"
          @input="onProgressInput"
          aria-label="Track Progress"
        />
      </div>

      <!-- Preview Error Message -->
      <div class="preview-error" v-if="!currentTrack?.preview_url">
        <div :class="{ 'svg-dark': darkOrLightFont(backgroundColour) }">
          <i class="bi bi-info-circle"></i>
          20-50% of Spotify songs don't have a preview audio clip.
          <br />You can toggle them appearing in the settings.
        </div>
      </div>

      <!-- Audio Element -->
      <audio
        v-if="currentTrack?.preview_url"
        ref="audioPlayer"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        :src="currentTrack.preview_url"
      ></audio>
    </div>
  </div>

  <!-- Loading Spinner -->
  <div
    v-else-if="recommendationStore.recommendationDataLoading"
    class="loading-container"
  >
    <LoadingSpinner :use-colors="false" style="margin-top: 20vh;" />
  </div>
</template>


<style scoped>
.preview-error {
  text-align: center;
  padding: 15px;
  font-size: 0.65rem;
  color: rgb(215, 215, 215);
}

.mobile-card-view {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.swiper {
  width: 100%;
  display: flex;
  align-items: center;
}

.swiper-wrapper {
  align-items: center;
}

.swiper-slide {
  position: relative;
  width: 80vw;
  aspect-ratio: 1/1;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.swiper-slide img {
  width: 100%;
  height: 100%;
}

.swiper-3d {
  perspective: 550px;
}

.mobile-player {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
}

.track-info {
  text-align: center;
  color: white;
}

.track-info h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.track-artist {
  color: rgba(220, 220, 220, 0.667);
  font-size: 0.9rem;
}

.track-artist:hover {
  color: white;
  text-decoration: underline;
}

.track-artist-dark {
  color: rgb(97, 97, 97);
}

.track-artist-dark:hover {
  color: rgb(34, 34, 34);
  text-decoration: underline;
}

.track-name-dark {
  color: black;
}

.progress-container {
  width: 100%;
  padding: 0 3rem;
}

#progress {
  width: 100%;
  height: 3px;
  appearance: none;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

#progress::-webkit-slider-thumb {
  appearance: none;
  background: white;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid black;
}

.progress-dark {
  background: rgb(0, 0, 0) !important;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 10px;
}

.play-pause-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-pause-btn i {
  color: white;
  font-size: 2.5rem;
}

.forward img,
.backward img {
  height: 32px;
  width: 32px;
  filter: invert(100);
}

.svg-dark {
  filter: brightness(0) saturate(100%) invert(9%) sepia(8%) saturate(1278%) hue-rotate(316deg)
    brightness(95%) contrast(85%) !important;
}

button.disabled i {
  color: rgba(201, 201, 201, 0.677);
}

#progress.disabled::-webkit-slider-thumb {
  background-color: rgba(201, 201, 201, 0.677);
}

#progress.disabled {
  background-color: rgba(201, 201, 201, 0.677);
}

.controls button:is(:hover, :focus-visible) {
  transform: scale(0.96);
}

.controls button:nth-child(2) {
  transform: scale(1.3);
}

.controls button:nth-child(2):is(:hover, :focus-visible) {
  transform: scale(1.25);
}

/* Loading Container */
.loading-container {
  width: 100vw;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

/* Responsive Adjustments if Needed */
@media (max-width: 1300px) {
  #progress {
    margin: 12px 0;
  }
}

@media (max-width: 1050px) {
  .mobile-card-view {
    margin: 0;
    border-radius: 0;
  }
}
</style>
