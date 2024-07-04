<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Swiper from 'swiper';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const props = defineProps<{
  recommendationData: any,
}>();

const tracks = computed(() => props.recommendationData.tracks || []);
const currentTrackIndex = ref(0);
const currentTrack = computed(() => tracks.value[currentTrackIndex.value]);
const isPlaying = ref(false);

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

const onProgressChange = () => {
  if (audioPlayer.value) {
    audioPlayer.value.play();
    isPlaying.value = true;
  }
};

const onEnded = () => {
  currentTime.value = TOTAL_DURATION;
  isPlaying.value = false;
};

const playNextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.value.length;
  swiper.slideNext();
};

const playPreviousTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.value.length) % tracks.value.length;
  swiper.slidePrev();
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
  swiper = new Swiper('.swiper', {
    modules: [EffectCoverflow],
    effect: 'coverflow',
    centeredSlides: true,
    initialSlide: currentTrackIndex.value,
    slidesPerView: 'auto',
    allowTouchMove: false,
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
  });
});
</script>

<template>
  <div class="card-view-root">
    <div class="album-cover">
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
      >
        <source :src="currentTrack?.preview_url" type="audio/mpeg" />
      </audio>

      <input 
        id="progress" 
        type="range" 
        :min="0"
        :max="300"
        :step="1"
        :value="progressValue"
        @input="onProgressInput" 
        @change="onProgressChange" 
      />

      <div class="controls">
        <div class="main-controls">
          <button class="backward" @click="playPreviousTrack">
            <img src="@/assets/backward.svg">
          </button>
          <button class="play-pause-btn" @click="playPause">
            <i :class="['bi', isPlaying ? 'bi-pause-fill' : 'bi-play-fill']" id="controlIcon"></i>
          </button>
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
  background-color: var(--secondary-colour);
  height: 100%;
  border-radius: 1rem;
  animation: slidein 120s forwards infinite alternate;
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

/* Music Player Controls */

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
}

.main-controls {
  display: flex;
  flex-direction: row;

  align-items: center;
}

/* Need to have this seperate to controls div or something */
.volume-control {
  display: flex;
  left: 25vw;
  align-items: center;
  position: absolute;
}

.volume-control input:hover, i:hover {
  cursor: pointer;
}

.volume-control i {
  font-size: 1.5rem;
  margin-right: 4px;
}

#volume-slider {
  appearance: none;
  -webkit-appearance: none;
  height: 3px;
  background: white;
  border-radius: 4px;
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
  justify-content: center;
  width: 50px;
  aspect-ratio: 1/1;
  margin: 20px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s linear;
}

.play-pause-btn i {
  color: var(--secondary-colour);
}

.forward img, .backward img {
  height: 40px;
  aspect-ratio: 1/1;
  filter: invert(100);
}

.play-pause-btn i {
  font-size: 30px;
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
}
</style>