<script setup lang="ts">
import { computed } from 'vue';
import { darkOrLightFont } from '@/utils/colourStyle';
import { useLocalSettingsStore } from '@/stores/localSettingsStore';

const localSettingsStore = useLocalSettingsStore();
const bgColour = computed(() => localSettingsStore.backgroundColour);

defineProps<{
  currentTrack: SpotifyApi.RecommendationTrackObject | undefined;
}>();
</script>

<template>
  <div class="track-info">
    <h1 class="track-name" :class="{ 'track-name-dark': darkOrLightFont(bgColour) }">
      <a class="track-title" :href="currentTrack?.external_urls.spotify" target="_blank">{{ currentTrack?.name }}</a>
    </h1>
    <div class="artist-list">
      <span v-for="(artist, index) in currentTrack?.artists" :key="artist.id">
        <a 
          class="track-artist"
          :class="{ 'track-artist-dark':
          darkOrLightFont(bgColour) }"
          :href="artist.uri"
        >
          {{artist.name }}
        </a>
        <span class="track-artist" :class="{ 'track-artist-dark': darkOrLightFont(bgColour) }"
          v-if="currentTrack && index < currentTrack.artists.length - 1">, </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.svg-light {
  filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(126deg) brightness(103%) contrast(102%);
}

.svg-grey {
  filter: brightness(0) saturate(100%) invert(87%) sepia(3%) saturate(8%) hue-rotate(333deg) brightness(96%) contrast(86%);
}

.track-info {
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

.track-name {
  font-size: 1.8rem;
  font-weight: 550;
  line-height: 1.6;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
}

.open-spotify {
  margin-left: 4px;
  max-width: 24px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.track-title:hover {
  text-decoration: underline;
}

.track-name:hover .open-spotify {
  opacity: 1;
}

.track-artist {
  font-size: 1.1rem;
  font-weight: 450;
  color: rgb(205, 205, 205);
}

.track-artist:hover {
  color: white;
  text-decoration: underline;
}

.track-artist-dark {
  color: rgb(68, 68, 68);
}

.track-artist-dark:hover {
  color: rgb(34, 34, 34);
  text-decoration: underline;
}
</style>