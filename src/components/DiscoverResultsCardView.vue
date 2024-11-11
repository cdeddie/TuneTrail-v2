<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick }                from 'vue';
import { getProminentColour }                                       from '@/types/TagType';
import { darkOrLightFont }                                          from '@/utils/colourStyle';
import Swiper                                                       from 'swiper';
import { EffectCoverflow }                                          from 'swiper/modules';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBackgroundStore }                                       from '@/stores/backgroundStore';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { SpotifyRecommendationResponse } from '@/types/SpotifyRecommendationResponse';

const props = defineProps<{
  recommendationData: SpotifyRecommendationResponse,
}>();

const isPlaying = ref<boolean>(false);
const currentTrackIndex = ref<number>(0);

const tracks = computed(() => {
  if (props.recommendationData && props.recommendationData.tracks) {
    return props.recommendationData.tracks;
  } else {
    return [];
  }
});

const currentTrack = computed(() => tracks.value ? tracks.value[currentTrackIndex.value] : null);

const audioPlayer = ref<HTMLAudioElement | null>(null);
const currentTime = ref(0);
const TOTAL_DURATION = 30;

const volume = ref(50);
const previousVolume = ref(50);

let swiper: Swiper;

const progressValue = computed(() => {
  return Math.round(currentTime.value * 10);
});

const playPause = () => {
  if (audioPlayer.value) {
    if (isPlaying.value) {
      audioPlayer.value.pause();
    } else {
      audioPlayer.value.play();
    }
    isPlaying.value = !isPlaying.value;
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

watch(currentTrack, () => {
  if (audioPlayer.value) {
    audioPlayer.value.load();
    if (isPlaying.value) {
      audioPlayer.value.play();
    }
  }
});

const toggleMute = () => {
  if (volume.value > 0) {
    previousVolume.value = volume.value;
    volume.value = 0;
  } else {
    volume.value = previousVolume.value > 0 ? previousVolume.value : 50;
  }
};

watch([() => audioPlayer.value, volume], () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100;
  }
}, { immediate: true });

const volumeIconClass = computed(() => {
  let result:string;
  if (volume.value == 0) {
    result = 'bi bi-volume-mute-fill';
  } else if (volume.value < 50) {
    result = 'bi bi-volume-down-fill';
  } else {
    result = 'bi bi-volume-up-fill';
  }

  return result;
});

// Vue component produced from https://codepen.io/ecemgo/pen/vYPadZz
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
      rotate: 30,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
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
}

watch(() => props.recommendationData, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (swiper) {
      swiper.destroy();
    }
    currentTrackIndex.value = 0;
    console.log('Index: ', currentTrackIndex.value);
    initializeSwiper();
    updateBackgroundColour();
  }
});

// Root background current track prominent colour logic
const backgroundStore = useBackgroundStore();
const backgroundColour = ref<string>('');
const updateBackgroundColour = async () => {
  if (!currentTrack.value) return;
  try {
    const imgUrl = currentTrack.value.album.images[0]?.url; 
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
  <div class="card-view-root" v-if="props.recommendationData?.tracks">
    <div class="album-cover" v-if="tracks.length">
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
    </div>

    <div class="music-player">
      <h1 :class="{ 'track-name-dark': darkOrLightFont(backgroundColour) }"><a :href="currentTrack?.uri">{{ currentTrack?.name }}</a></h1>
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
            v-if="currentTrack && index < currentTrack.artists.length - 1"
          >, </span>
        </span>
      </p>

      <div class="controls">
        <div class="add-placeholder"></div>

        <div class="main-controls">
          <button class="backward" @click="playPreviousTrack">
            <img src="@/assets/backward.svg" :class="{ 'svg-dark': darkOrLightFont(backgroundColour) }">
          </button>

          <!-- Unfortunately don't know a way to conditionally render tooltip other than this -->
          <div v-if="currentTrack && currentTrack.preview_url === null">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <button 
                    class='play-pause-btn'
                    :class="{ 'disabled': currentTrack?.preview_url === null }"
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
                </TooltipTrigger>

                <TooltipContent>
                  <p style="text-align: center;">
                    Approximately 20% of Spotify songs will not have a preview audio clip unfortunately. <br>You can toggle them appearing in recommendations in the settings.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div v-else>
            <button 
              class='play-pause-btn'
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
          </div>

          <button class="forward" @click="playNextTrack">
            <img src="@/assets/forward.svg" :class="{ 'svg-dark': darkOrLightFont(backgroundColour) }">
          </button>
        </div>

        <div class="volume-control">
          <label for="volume-slider" @click="toggleMute">
            <i :class="[volumeIconClass, { 'svg-dark': darkOrLightFont(backgroundColour) }]"></i>
          </label>
          <input 
            type="range"
            :class="{ 'slider-dark': darkOrLightFont(backgroundColour) }" 
            id="volume-slider" 
            min="0" 
            max="100" 
            v-model="volume"
          >
        </div>
      </div>

      <audio 
        v-if="currentTrack?.preview_url"
        ref="audioPlayer" 
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        :src="currentTrack?.preview_url"
      ></audio>

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
  </div>
</template>

<style scoped>
.card-view-root {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 1rem;
}

i {
  color: white;
}

.album-cover {
  display: flex;
  width: 98%;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}

.swiper-slide {
  position: relative;
  max-width: 20vw;
  aspect-ratio: 1/1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.swiper-slide img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  /* -webkit-box-reflect: below -5px linear-gradient(transparent, transparent, rgba(0, 0, 0, 0.4)); */
  transform-origin: center;
  transform: perspective(800px);
  transition: 0.3s ease-out;
  pointer-events: none;
  user-select: none;
}

.swiper-slide-active .overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 98%;
  background-color: rgba(28, 22, 37, 0.6);
  border-radius: inherit;
  opacity: 0;
  transition: all 0.3s linear;
}


/* Music Player */

.music-player {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  
  padding: 10px 30px;
  border-radius: 20px;
}

.track-name-dark {
  color: black;
}

.music-player h1 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.6;
}

.music-player p {
  font-size: 1rem;
  font-weight: 400;
}

.track-artist {
  color: rgba(220, 220, 220, 0.667);
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

/* Music Player Progress */

#progress {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  width: 25vw;
  background: white;
  border-radius: 4px;
  margin: 12px 0 24px;
  cursor: pointer;
}

#progress::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  background: white;
  width: 10px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  outline: 3px solid black;
}

.progress-dark {
  background: rgb(0, 0, 0) !important;
}

#progress.disabled::-webkit-slider-thumb {
  background-color: rgba(201, 201, 201, 0.677);
}

#progress.disabled {
  background-color: rgba(201, 201, 201, 0.677);
}

/* Music Player Controls */

/* For bright backgrounds
.dark {
  background: black;
} */

.controls {
  display: flex;
  align-items: center;
}

.add-placeholder {
  width: 161px;
  margin-right: 10px;
}

.main-controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

/* Need to have this seperate to controls div or something */
.volume-control {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.volume-control label {
  cursor: pointer;
  transition: all 0.3s ease;
}

.volume-control input:hover, i:hover {
  cursor: pointer;
}

.volume-control i {
  font-size: 1.75rem;
  margin-right: 4px;
}

.volume-control:hover #volume-slider {
  opacity: 1;
  margin-left: 0;
}

#volume-slider {
  appearance: none;
  height: 3px;
  background: white;
  border-radius: 4px;

  opacity: 0;
  transition: all 0.3s ease;
}

#volume-slider::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  background: white;
  width: 12px;
  aspect-ratio: 1/1;
  border-radius: 50%;
}

.slider-dark {
  background: black !important;
}

.slider-dark::-webkit-slider-thumb {
  background: black !important;
}

.controls .play-pause-btn {
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-left: 10px;
  overflow: hidden;
  width: fit-content;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-pause-btn i {
  color: white;
  font-size: 3.5rem;
}

button.disabled i {
  color: rgba(201, 201, 201, 0.677);
}

.forward, .backward {
  transition: all 0.3s ease;
}

.forward img, .backward img {
  height: 40px;
  aspect-ratio: 1/1;
  filter: invert(100);
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

.svg-dark {
  filter: brightness(0) saturate(100%) invert(9%) sepia(8%) saturate(1278%) hue-rotate(316deg) brightness(95%) contrast(85%) !important;
}

@media (max-width: 1600px) {
  .volume-control {
    left: calc(50vw + 55px);
  }
}

@media (max-width: 1300px) {
  #progress {
    margin: 12px 0;
  }
}

@media (max-width: 1050px) {
  .card-view-root {
    margin: 0;
    border-radius: 0;
  }

  .results-container {
    margin-bottom: 0;
  }

  .volume-control {
    left: calc(50vw + 85px);
  }
}
</style>