<script setup lang="ts">
import { ref, onMounted, computed, watch }  from 'vue';
import { getProminentColour }               from '@/types/TagType';
import { truncateString }                   from '@/utils/stringProcessing';
import { Track }                            from '@/types/SpotifyCommonTypes';

const props = defineProps<{
  track: Track,
  pauseEvent: boolean,
}>();

const emits = defineEmits<{
  (event: 'play-next'): void,
  (event: 'play-prev'): void
}>();

const trackColour = ref<string>('');

onMounted(async () => {
  trackColour.value = await getProminentColour(props.track.album.images[0].url);
});

watch(async () => props.track, async (newTrack) => {
  const resolved = await newTrack;
  trackColour.value = await getProminentColour(resolved.album.images[0].url);
});

watch(() => props.pauseEvent, (newValue) => {
  if (!newValue) return;
  if (!audioPlayer.value) return;
  if (isPlaying.value) {
    playPause();
  }
});

// Preview audio tag play logic
const isPlaying = ref<boolean>(false);

const audioPlayer = ref<HTMLAudioElement | null>(null);
const currentTime = ref(0);
const TOTAL_DURATION = 30;

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
  if (isPlaying.value) playPause();
  emits('play-next');
};

const playPreviousTrack = () => {
  if (isPlaying.value) playPause();
  emits('play-prev');
};
</script>

<template>
  <div class="track-card" :style="{ backgroundColor: trackColour }">
    <div class="album-img"><img :src="track?.album.images[0].url"></div>

    <div class="music-player">
      <h1 style="text-align: center;"><a :href="track?.uri">{{ truncateString(track?.name, 40) }}</a></h1>
      <p>
        <span v-for="(artist, index) in track?.artists" :key="artist.id">
          <a :href="artist.uri">{{ artist.name }}</a>
          <span v-if="index < track?.artists.length - 1">, </span>
        </span>
      </p>

      <audio 
        v-if="track.preview_url"
        ref="audioPlayer" 
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        :src="track?.preview_url"
      ></audio>

      <input 
        id="progress" 
        :class="{ 'disabled': track?.preview_url === null  }"
        type="range" 
        :min="0"
        :max="300"
        :step="1"
        :value="progressValue"
        :disabled="track?.preview_url === null" 
        @input="onProgressInput" 
      />

      <div class="controls">
        <button class="backward" @click="playPreviousTrack">
          <img src="@/assets/backward.svg">
        </button>

        <button 
            class='play-pause-btn'
            :class="{ 'disabled': track?.preview_url === null }"
            :disabled="track?.preview_url === null" 
            @click="playPause"
          >
            <i 
              :class="[
                'bi', 
                isPlaying ? 'bi-pause-circle-fill' : 'bi-play-circle-fill', 
                { 'bi-play-circle-fill': track?.preview_url === null }
              ]" 
              id="controlIcon"
            ></i>
          </button>

          <button class="forward" @click="playNextTrack">
            <img src="@/assets/forward.svg">
          </button>
      </div>
    </div>
    
    <div class="preview-error" v-if="track?.preview_url === null">
      <div>
        <i class="bi bi-info-circle"></i>
        Spotify does not provide all recommended tracks with a preview audio clip.
        Login with your Spotify account to fix.
      </div>
    </div>
  </div>
</template>

<style scoped>
.track-card {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
}

.album-img {
  padding: 20px;
}

.album-img img {
  border-radius: 1rem;
}

/* ----- Music player ----- */
.music-player {
  padding: 0 20px;
}

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
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.6;
}

.music-player p {
  font-size: .8rem;
  font-weight: 400;
}

.music-player p a {
  color: rgb(237, 237, 237);
}

#progress {
  appearance: none;
  -webkit-appearance: none;
  height: 3px;
  width: 100%;
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

/* ----- Music controls ----- */
.controls {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.controls .play-pause-btn {
  display: flex;
  align-items: center;
  margin-right: 20px;
  margin-left: 20px;
  overflow: hidden;
  width: fit-content;
  cursor: pointer;
  transition: all 0.3s linear;
}

.play-pause-btn i {
  color: white;
  font-size: 3.2rem;
}

button.disabled i {
  color: rgba(201, 201, 201, 0.677);
}

.forward img, .backward img {
  height: 50px;
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

.preview-error {
  text-align: center;
  padding: 0 15px 10px 15px;
  font-size: .55rem;
  color: rgb(215, 215, 215);
}
</style>