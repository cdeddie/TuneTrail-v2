<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed }    from 'vue';
import { getProminentColour }                           from '@/types/TagType';
import { darkOrLightFont }                              from '@/utils/colourStyle';
import Swiper                                           from 'swiper';
import { EffectCoverflow }                              from 'swiper/modules';
import { useBackgroundStore }                           from '@/stores/backgroundStore';
import { truncateString }                               from '@/utils/stringProcessing';
import { SpotifyRecommendationResponse }                from '@/types/SpotifyRecommendationResponse';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const props = defineProps<{
  recommendationData: SpotifyRecommendationResponse,
}>();

const isPlaying = ref<boolean>(false);
const currentTrackIndex = ref<number>(0);
const audioPlayer = ref<HTMLAudioElement | null>(null);
const currentTime = ref(0);
const TOTAL_DURATION = 30;
const volume = ref(50);

const tracks = computed(() => {
  if (props.recommendationData && props.recommendationData.tracks) {
    return props.recommendationData.tracks;
  } else {
    return [];
  }
});

const currentTrack = computed(() => tracks.value ? tracks.value[currentTrackIndex.value] : null);

// Audio player logic
const progressValue = computed(() => {
  return Math.round(currentTime.value * 10);
});

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

// Volume control
// const toggleMute = () => {
//   if (volume.value > 0) {
//     previousVolume.value = volume.value;
//     volume.value = 0;
//   } else {
//     volume.value = previousVolume.value > 0 ? previousVolume.value : 50;
//   }
// };

// const volumeIconClass = computed(() => {
//   if (volume.value == 0) return 'bi bi-volume-mute-fill';
//   return volume.value < 50 ? 'bi bi-volume-down-fill' : 'bi bi-volume-up-fill';
// });

watch([() => audioPlayer.value, volume], () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100;
  }
}, { immediate: true });

// Core swiper logic
let swiper: Swiper;

onMounted(() => {
  initializeSwiper();
});

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

watch(() => props.recommendationData, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (swiper) {
      swiper.destroy();
    }
    currentTrackIndex.value = 0;
    initializeSwiper();
    updateBackgroundColour();
  }
});

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

// Background color logic
const backgroundStore = useBackgroundStore();
const backgroundColour = ref<string>('');

const updateBackgroundColour = async () => {
  if (!currentTrack.value) return;
  try {
    const imgUrl = currentTrack.value.album.images[0].url;
    backgroundColour.value = await getProminentColour(imgUrl);
    backgroundStore.setBackgroundColour(backgroundColour.value);
    document.documentElement.style.setProperty('--bg', backgroundColour.value);
  } catch (error) {
    console.error('Error extracting prominent color:', error);
    backgroundColour.value = 'transparent';
  }
};

onMounted(() => {
  updateBackgroundColour();
});

watch(currentTrack, () => {
  updateBackgroundColour();
});
</script>

<template>
  <div class="mobile-card-view" v-if="props.recommendationData?.tracks">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div v-for="(track) in tracks" :key="track.id" class="swiper-slide">
          <img :src="track.album.images[0]?.url" />
          <div class="overlay">
            <a :href="track.external_urls.spotify" target="_blank"></a>
          </div>
        </div>
      </div>
    </div>

    <div class="mobile-player">
      <div class="track-info" v-if="currentTrack">
        <h2 :class="{ 'track-name-dark': darkOrLightFont(backgroundColour) }">
          <a :href="currentTrack?.uri">{{ truncateString(currentTrack.name, 32) }}</a>
        </h2>
        <p>
          <span v-for="(artist, index) in currentTrack?.artists" :key="artist.id">
            <a 
              class="track-artist"
              :class="{ 'track-artist-dark': darkOrLightFont(backgroundColour) }"
              :href="artist.uri"
            >{{ artist.name }}</a>
            <span 
              class="track-artist" 
              :class="{ 'track-artist-dark': darkOrLightFont(backgroundColour) }" 
              v-if="index < currentTrack.artists.length - 1"
            >, </span>
          </span>
        </p>
      </div>

      <div class="controls">
        <button class="backward" @click="playPreviousTrack">
          <img src="@/assets/backward.svg" :class="{ 'svg-dark': darkOrLightFont(backgroundColour) }">
        </button>

        <button 
          class="play-pause-btn"
          :class="{ 'disabled': currentTrack?.preview_url === null, 'svg-dark': darkOrLightFont(backgroundColour) }"
          :disabled="currentTrack?.preview_url === null" 
          @click="playPause"
        >
          <i 
            :class="[
              'bi', 
              isPlaying ? 'bi-pause-circle-fill' : 'bi-play-circle-fill', 
              { 'bi-play-circle-fill': currentTrack?.preview_url === null }
            ]" 
            id="controlIcon"
          ></i>
        </button>

        <button class="forward" @click="playNextTrack">
          <img src="@/assets/forward.svg" :class="{ 'svg-dark': darkOrLightFont(backgroundColour) }">
        </button>
      </div>

      <div class="progress-container">
        <input 
          id="progress" 
          :class="{ 'disabled': currentTrack?.preview_url === null, 'progress-dark': darkOrLightFont(backgroundColour) }"
          type="range" 
          :min="0"
          :max="300"
          :step="1"
          :value="progressValue"
          :disabled="currentTrack?.preview_url === null" 
          @input="onProgressInput" 
        />
      </div>

      <div class="preview-error" v-if="currentTrack?.preview_url === null">
        <div :class="{ 'svg-dark': darkOrLightFont(backgroundColour) }">
          <i class="bi bi-info-circle"></i>
          Spotify does not provide all recommended tracks with a preview audio clip.
          Login with your Spotify account to fix.
        </div>
      </div>

      <audio
        v-if="currentTrack?.preview_url"
        ref="audioPlayer" 
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        :src="currentTrack.preview_url"
      ></audio>
    </div>
  </div>
</template>

<style scoped>
.preview-error {
  text-align: center;
  padding: 15px;
  font-size: .65rem;
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

.forward img, .backward img {
  height: 32px;
  width: 32px;
  filter: invert(100);
}

.svg-dark {
  filter: brightness(0) saturate(100%) invert(9%) sepia(8%) saturate(1278%) hue-rotate(316deg) brightness(95%) contrast(85%) !important;
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
</style>