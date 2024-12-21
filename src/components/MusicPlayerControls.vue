<script setup lang="ts">
import { ref, computed, watch, nextTick }           from 'vue';
import { Tooltip, TooltipContent, TooltipTrigger }  from '@/components/ui/tooltip';
import Swiper                                       from 'swiper';

import { useLocalSettingsStore }  from '@/stores/localSettingsStore';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { useAuthStore }           from '@/stores/authStore';
import { darkOrLightFont }        from '@/utils/colourStyle';

import AnimatedHeart                from './AnimatedHeart.vue';
import volumeOff                    from '@/assets/volume-off.svg';
import volumeLow                    from '@/assets/volume-low.svg';
import volumeMedium                 from '@/assets/volume-medium.svg';
import volumeHigh                   from '@/assets/volume-high.svg';
import playCircleFill               from '@/assets/play-circle-fill.svg';
import pauseCircleFill              from '@/assets/pause-circle-fill.svg';

const props = defineProps<{
  currentTrack: SpotifyApi.RecommendationTrackObject | undefined;
  swiper?: Swiper;
}>();

const authStore = useAuthStore();
const recommendationStore = useRecommendationStore();
const localSettingsStore = useLocalSettingsStore();
const bgColour = computed(() => localSettingsStore.backgroundColour);

const volumeIconSrc = computed(() => {
  const volume = localSettingsStore.audioVolume;
  if (volume <= 0) {
    return volumeOff;
  } else if (volume < 33) {
    return volumeLow;
  } else if (volume < 66) {
    return volumeMedium;
  } else {
    return volumeHigh;
  }
});

watch(() => localSettingsStore.audioVolume, (newVolume) => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = newVolume / 100;
  }
});

const onAudioMounted = () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = localSettingsStore.audioVolume / 100;
    audioDuration.value = Math.floor(audioPlayer.value.duration);
  }
};

const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref<boolean>(false);
const audioTime = ref<number>(0);
const audioProgressValue = computed(() => Math.round(audioTime.value * 10));
const audioDuration = ref<number>(0);

const playPause = () => {
  if (!audioPlayer.value) return;
  if (isPlaying.value) {
    audioPlayer.value.pause();
  } else {
    audioPlayer.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const onTimeUpdate = () => {
  if (audioPlayer.value) {
    audioTime.value = audioPlayer.value.currentTime;
  }
};

const onProgressInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (audioPlayer.value) {
    const value = Number(target.value);
    const time = value / 10;
    audioTime.value = time;
    audioPlayer.value.currentTime = time;
  }
};

const onEnded = async() => {
  isPlaying.value = false;
  audioTime.value = 0;

  if (autoplay.value) {
    props.swiper?.slideNext();
    autoplayLogic();
  }
};

const slidePrev = async() => {
  if (props.swiper) {
    props.swiper.slidePrev();
    audioTime.value = 0;
  }
  if (isPlaying.value) {
    isPlaying.value = false;
  }
  if (autoplay.value) {
    autoplayLogic();
  }
};

const slideNext = async() => {
  if (props.swiper) {
    props.swiper.slideNext();
    audioTime.value = 0;
  }
  if (isPlaying.value) {
    isPlaying.value = false;
  }
  if (autoplay.value) {
    autoplayLogic();
  }
};

// Autoplay logic
const autoplay = ref<boolean>(false);

const autoplayLogic = async() => {
  await nextTick();
  if (!props.currentTrack?.preview_url) {
    setTimeout(() => {
      onEnded();
    }, 500);
  }
  playPause();
};
</script>

<template>
  <div class="controls">
    <div class="left-controls">
      <Tooltip>
        <TooltipTrigger class="auto-play-tooltip">
          <div class="auto-play-control">
            <button @click="autoplay = !autoplay" class="auto-play-button">
              <div class="toggle-circle" :class="{ autoplayActive: autoplay }">
                <img class="autoplay-svg" src="@/assets/autoplay.svg" :class="{ 'svg-light': !darkOrLightFont(bgColour) }">
              </div>
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Autoplay</p>
        </TooltipContent>
      </Tooltip>
    </div>

    <div class="main-controls">
      <button class="backward" @click="slidePrev">
        <img class="icon-scale" src="@/assets/backward.svg" :class="{ 'svg-light': !darkOrLightFont(bgColour) }">
      </button>

      <!-- If no preview audio exists for the current track -->
      <div v-if="currentTrack?.preview_url === null" class="play-pause-btn">
        <Tooltip>
          <TooltipTrigger>
            <img src="@/assets/play-circle-fill.svg" class="svg-grey svg-disabled">
          </TooltipTrigger>
          <TooltipContent>
            <p style="text-align: center;">
              Anywhere from 20-50% of Spotify songs will not have a preview audio clip unfortunately. <br>You can toggle them appearing in the settings.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <!-- If the current track does have preview audio -->
      <div v-else>
        <button 
          class="play-pause-btn icon-scale"
          :class="{ 'svg-dark': !darkOrLightFont(bgColour) }"
          :disabled="currentTrack?.preview_url === null" 
          @click="playPause"
        >
          <img class="play-pause-svg" :src="isPlaying ? pauseCircleFill : playCircleFill" >
        </button>
      </div>

      <button class="forward icon-scale" @click="slideNext">
        <img src="@/assets/forward.svg" :class="{ 'svg-light': !darkOrLightFont(bgColour) }">
      </button>
    </div>

    <div class="right-controls">
      <Tooltip>
        <TooltipTrigger>
          <AnimatedHeart :current-track="currentTrack" />
        </TooltipTrigger>
        <TooltipContent>
          <p v-if="!authStore.isLoggedIn">Log in to add song to liked</p>
          <p v-else-if="currentTrack && recommendationStore.likedTracksSet.has(currentTrack.id)">Song already in liked</p>
          <p v-else>Add song to liked</p>
        </TooltipContent>
      </Tooltip>

      <div class="volume-control">
        <label for="volumeSlider">
          <img class="volume-icon" :src="volumeIconSrc" :class="{ 'svg-light': !darkOrLightFont(bgColour) }">
        </label>
        <input
          type="range"
          :class="{ 'slider-dark': darkOrLightFont(bgColour) }"
          id="volumeSlider"
          min="0"
          max="100"
          v-model="localSettingsStore.audioVolume"
        >
      </div>
    </div>
  </div>

  <audio
    v-if="currentTrack?.preview_url"
    ref="audioPlayer"
    :src="currentTrack?.preview_url"
    @ended="onEnded"
    @loadedmetadata="onAudioMounted"
    @timeupdate="onTimeUpdate"
  ></audio>

  <input
    id="audioProgress"
    :class="{ 'progress-disabled': currentTrack?.preview_url === null, 'progress-dark': darkOrLightFont(bgColour) }"
    type="range"
    min="0"
    :max="audioDuration * 10"
    step="1"
    :value="audioProgressValue"
    :disabled="currentTrack?.preview_url === null"
    @input="onProgressInput"
  >
</template>

<style scoped>
.svg-light {
  filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(126deg) brightness(103%) contrast(102%);
}

.svg-grey {
  filter: brightness(0) saturate(100%) invert(87%) sepia(3%) saturate(8%) hue-rotate(333deg) brightness(96%) contrast(86%);
}

.svg-dark {
  filter: invert(100);
}

.svg-disabled:hover {
  cursor: not-allowed;
}

.icon-scale {
  transition: transform 0.3s ease;
}

.icon-scale:hover {
  transform: scale(1.075);
}

.backward img, .forward img {
  width: 50px;
}

.controls {
  display: flex;
  flex-direction: row;
}

.left-controls {
  min-width: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* Autoplay styles */
.auto-play-tooltip {
  margin-left: auto;
  margin-right: .6vw;
}

.auto-play-control {
  display: flex;
  align-items: center;
}

.auto-play-button {
  width: 25px;
}

.autoplay-svg {
  transition: filter 0.3s ease;
}

.autoplayActive .autoplay-svg {
  filter: brightness(0) saturate(100%) invert(60%) sepia(78%) saturate(517%) hue-rotate(87deg) brightness(84%) contrast(83%);
}

.toggle-circle {
  border-radius: 10px;
  width: 35px;
  padding: 5px;
  transition: background-color 0.3s;
}

.autoplayActive {
  background-color: rgba(158, 158, 158, 0.217);
}

.main-controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.right-controls {
  min-width: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.play-pause-btn {
  width: 60px;
  margin: 0 4px;
}

/* Volume control styles */
.volume-control {
  display: flex;
  align-items: center;
  margin-left: 8px;
  margin-right: 4px;
}

.volume-control input:hover, i:hover, label {
  cursor: pointer;
}

.volume-icon {
  width: 30px;
}

#volumeSlider {
  appearance: none;
  height: 3px;
  background: white;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.3s ease;
}

.volume-control:hover #volumeSlider {
  opacity: 1;
  margin-left: 4px;
}

#volumeSlider::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  background: white;
  width: 12px;
  aspect-ratio: 1/1;
  border-radius: 50%;
}

#volumeSlider.slider-dark {
  background: black;
}

#volumeSlider.slider-dark::-webkit-slider-thumb {
  background: black;
}

/* Audio Prorgress Slider */
#audioProgress {
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

#audioProgress::-webkit-slider-thumb {
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

#audioProgress.disabled::-webkit-slider-thumb {
  background-color: rgba(201, 201, 201, 0.677);
}

#audioProgress.disabled {
  background-color: rgba(201, 201, 201, 0.677);
}
</style>