<script setup lang="ts">
import FloatingLabelSearch  from '@/components/FloatingLabelSearch.vue';
import SwitchButton         from './SwitchButton.vue';

import { ref }                    from 'vue';
import { Skeleton }               from './ui/skeleton';
import { truncateString }         from '@/utils/stringProcessing';
import { useRecommendationStore } from '@/stores/recommendationStore';

const trackSearchResults = ref<SpotifyApi.TrackSearchResponse>();
const artistSearchResults = ref<SpotifyApi.ArtistSearchResponse>();
const searchLoading = ref<boolean>(false);
const searchFocused = ref<boolean>(false);
const searchDisabled = ref<boolean>(false);

const recommendationStore = useRecommendationStore();

const handleSearchResults = (newSearchResults: SpotifyApi.TrackSearchResponse | SpotifyApi.ArtistSearchResponse) => {
  if (recommendationStore.activeCategory === 'Tracks' && 'tracks' in newSearchResults) {
    trackSearchResults.value = newSearchResults;
  } else if (recommendationStore.activeCategory === 'Artists' && 'artists' in newSearchResults) {
    artistSearchResults.value = newSearchResults;
  }
};
</script>

<template>
  <div class="search-container">
    <FloatingLabelSearch
      :placeholder="searchDisabled ? 
                      'Maximum number reached' 
                      : `Add up to 5 ${recommendationStore.activeCategory.toLowerCase()}`"
      :search-category="recommendationStore.activeCategory"
      :search-disabled="recommendationStore.currentTags.length >= 5"
      @search-results="handleSearchResults"
      @search-results-loading="(newSearchLoading: boolean) => searchLoading = newSearchLoading"
      @search-focused="(newSearchFocused: boolean) => searchFocused = newSearchFocused"
    />
  </div>
  <SwitchButton 
    :left="'Tracks'"
    :right="'Artists'"
    @update-active-value="(newActiveValue: string) => { recommendationStore.activeCategory = newActiveValue}"
  />

  <div class="search-results" v-if="searchFocused">
    <div v-if="searchLoading">
      <Skeleton class="search-skeleton"></Skeleton>
      <Skeleton class="search-skeleton"></Skeleton>
      <Skeleton class="search-skeleton"></Skeleton>
      <Skeleton class="search-skeleton"></Skeleton>
      <Skeleton class="search-skeleton"></Skeleton>
    </div>

    <div v-else class="finished-loading">
      <div class="tracks-results" v-if="recommendationStore.activeCategory === 'Tracks'">
        <div
          class="search-result-card"
          v-for="(track) in trackSearchResults?.tracks.items"
          :key="track.id"
          @click="recommendationStore.addTrackTag(track)"
        >
          <img
            :src="track.album.images[0].url"
            class="card-img"
          >
          <div class="card-info">
            <span class="result-title">{{ track.name }}</span>
            <span class="result-subtitle">
                <i 
                  v-if="track.explicit"
                  class="bi bi-explicit-fill"
                  style="margin-right: 2px;"
                ></i>
                {{ truncateString(track.artists[0].name, 30) }}
              </span>
          </div>
        </div>
      </div>

      <div class="artists-results" v-else-if="recommendationStore.activeCategory === 'Artists'">
        <div
          class="search-result-card"
          v-for="(artist) in artistSearchResults?.artists.items"
          :key="artist.id"
          @click="recommendationStore.addArtistTag(artist)"
        >
          <img
            v-if="artist.images[0]"
            :src="artist.images[0].url"
            class="card-img"
          >
          <i v-else class="bi bi-person-fill img-alt"></i>
          <div class="card-info">
            <span class="result-title">{{ artist.name }}</span>
            <span class="result-subtitle">{{ artist.genres[0] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  flex-grow: 1;
}

.search-skeleton {
  height: 7.5vh;
  display: flex;
  flex-direction: row;
  
  padding: 5px 10px;
  align-items: center;
  background-color: #D9D9D9;
  background-clip: content-box;
  border-radius: 1.35rem;
}

.search-skeleton:first-child {
  padding-top: 10px;
}

.search-skeleton:last-child {
  padding-bottom: 10px;
}

.search-results {
  background-color: white;
  margin-top: calc(5vh + 10px);
  position: absolute;
  left: calc(var(--search-element-left));
  width: calc(var(--search-element-width));

  border-radius: 1rem;
  z-index: 1111;

  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
  height: fit-content;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.search-result-card {
  height: 7.5vh;
  display: flex;
  flex-direction: row;
  
  padding: 5px 10px;
  align-items: center;
  background-color: #D9D9D9;
  background-clip: content-box;
  border-radius: 1.35rem;
  transition: transform 0.3s ease;
}

.search-result-card:hover {
  transform: scale(1.01);
  cursor: pointer;
}

.search-result-card:first-child {
  padding-top: 10px;
}

.search-result-card:last-child {
  padding-bottom: 10px;
}

.card-img {
  height: 4.5vh;
  margin-left: 25px; 
}

.img-alt {
  font-size: 2.5rem;
  margin-left: 25px;
}

.card-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  color: black;
}

.result-title {
  font-weight: 700;
  font-size: 1rem;
}

.result-subtitle {
  font-size: .75rem;
  font-weight: 550;
}
</style>