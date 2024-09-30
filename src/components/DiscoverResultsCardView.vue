<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick }                from 'vue';
import { getAverageColour }                                         from '@/types/TagType';
import { darkOrLightFont }                                          from '@/utils/colourStyle';
import Swiper                                                       from 'swiper';
import { EffectCoverflow }                                          from 'swiper/modules';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const props = defineProps<{
  recommendationData: any,
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

const currentTrack = computed(() => tracks.value ? tracks.value[currentTrackIndex.value] : 0);

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
  if (volume.value == 0) {
    return 'bi bi-volume-mute-fill';
  } else if (volume.value < 50) {
    return 'bi bi-volume-down-fill';
  } else {
    return 'bi bi-volume-up-fill';
  }
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
      rotate: 25,
      stretch: 0,
      depth: 50,
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
  });
}

watch(() => props.recommendationData, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (swiper) {
      swiper.destroy();
    }
    initializeSwiper();
  }
});

// Root background current track prominent colour logic
const backgroundColour = ref<string>('');
const updateBackgroundColour = async () => {
  console.log(currentTrack.value.album);
  try {
    const imgUrl = currentTrack.value.album.images[0]?.url; 
    backgroundColour.value = await getAverageColour(imgUrl);
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
  console.log(backgroundColour.value)
});
</script>

<template>
  <div class="card-view-root" v-if="props.recommendationData?.tracks" :style="{ backgroundColor: backgroundColour }">
    <div class="album-cover" v-if="tracks.length">
      <div class="swiper">
        <div class="swiper-wrapper">
          <div v-for="(track) in tracks" :key="track.id" class="swiper-slide">
            <img :src="track.album.images[0]?.url" />
            <div class="overlay">
              <a :href="track.external_urls.spotify" target="_blank">
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="music-player">
      <h1><a :href="currentTrack?.uri">{{ currentTrack?.name }}</a></h1>
      <p>
        <span v-for="(artist, index) in currentTrack?.artists" :key="artist.id">
          <a :href="artist.uri">{{ artist.name }}</a>
          <span v-if="index < currentTrack.artists.length - 1" style="color: rgba(220, 220, 220, 0.667);">, </span>
        </span>
      </p>

      <audio 
        ref="audioPlayer" 
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        :src="currentTrack?.preview_url"
      ></audio>

      <input 
        id="progress" 
        :class="{ 'disabled': currentTrack?.preview_url === null  }"
        type="range" 
        :min="0"
        :max="300"
        :step="1"
        :value="progressValue"
        :disabled="currentTrack?.preview_url === null" 
        @input="onProgressInput" 
      />
    </div>

    <div class="controls">
      <div class="add-placeholder">

      </div>

      <div class="main-controls">
        <button class="backward" @click="playPreviousTrack">
          <img src="@/assets/backward.svg">
        </button>

        <!-- Unfortunately don't know a way to conditionally render tooltip other than this -->
        <div v-if="currentTrack?.preview_url === null">
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
                  Spotify does not provide all recommended tracks with a preview audio clip.<br>
                  Login with your Spotify account to fix.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div v-else>
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
        </div>

        <button class="forward" @click="playNextTrack">
          <img src="@/assets/forward.svg">
        </button>
      </div>

      <div class="volume-control">
        <label for="volume-slider" @click="toggleMute">
          <i :class="volumeIconClass"></i>
        </label>
        <input 
          type="range" 
          id="volume-slider" 
          min="0" 
          max="100" 
          v-model="volume"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-view-root {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 2vw;
  height: 100%;
  border-radius: 1rem;
  animation: slidein 120s forwards infinite alternate;
  transition: background-color .7s ease;
}

@keyframes slidein {
  0%,
  100% {
    background-position: 20% 0%;
    background-size: 3400px;
  }
  50% {
    background-position: 100% 0%;
    background-size: 2400px;
  }
}

i {
  color: white;
}

.album-cover {
  width: 90%;
}

.swiper {
  width: 100%;
  padding: 40px 0 100px;
}

.swiper-slide {
  position: relative;
  max-width: 200px;
  aspect-ratio: 1/1;
  border-radius: 10px;
}

.swiper-slide img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  -webkit-box-reflect: below -5px linear-gradient(transparent, transparent, rgba(0, 0, 0, 0.4));
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
  transition: all 0.4s linear;
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

.music-player h1 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.6;
}

.music-player p {
  font-size: 1rem;
  font-weight: 400;
}

.music-player p a {
  color: rgba(220, 220, 220, 0.667);
}

.music-player p a:hover {
  color: white;
  text-decoration: underline;
}

/* Music Player Progress */

#progress {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  width: 20vw;
  background: white;
  border-radius: 4px;
  margin: 32px 0 24px;
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

#progress.disabled::-webkit-slider-thumb {
  background-color: rgba(201, 201, 201, 0.677);
}

#progress.disabled {
  background-color: rgba(201, 201, 201, 0.677);
}

/* Music Player Controls */

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
  -webkit-appearance: none;
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

.controls .play-pause-btn {
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-left: 10px;
  overflow: hidden;
  width: fit-content;
  cursor: pointer;
  transition: all 0.3s linear;
}

.play-pause-btn i {
  color: white;
  font-size: 3.5rem;
}

button.disabled i {
  color: rgba(201, 201, 201, 0.677);
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