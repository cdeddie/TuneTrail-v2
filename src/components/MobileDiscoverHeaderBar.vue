<script setup lang="ts">
import { ref }                    from 'vue';
import DiscoverSearch             from '@/components/FloatingLabelSearch.vue';
import DrawerSettings             from '@/components/DrawerSettings.vue'; 
import { useRecommendationStore } from '@/stores/recommendationStore';
import { truncateString }         from '@/utils/stringProcessing';

import { 
  Drawer, 
  DrawerContent, 
  DrawerDescription, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger }         from '@/components/ui/drawer';
import { VisuallyHidden } from 'radix-vue';

const recommendationStore = useRecommendationStore();

const searchResults = ref<SpotifyApi.TrackSearchResponse>();
const searchLoading = ref<boolean>(false);
const searchFocused = ref<boolean>(false);
const searchDisabled = ref<boolean>(false);

const searchElement = ref<InstanceType<typeof DiscoverSearch> | null>(null);

// Type Guard
function isTrackSearchResponse(
  value: SpotifyApi.ArtistSearchResponse | SpotifyApi.TrackSearchResponse
): value is SpotifyApi.TrackSearchResponse {
  return (value as SpotifyApi.TrackSearchResponse).tracks !== undefined;
}

// Handlers
function handleSearchResults(
  newSearchResults: SpotifyApi.ArtistSearchResponse | SpotifyApi.TrackSearchResponse
) {
  if (isTrackSearchResponse(newSearchResults)) {
    searchResults.value = newSearchResults; // Safe assignment
  } else {
    console.error('Received non-track search response');
  }
}
</script>

<template>
  <div class="search-container">
    <DiscoverSearch 
      ref="searchElement"
      :placeholder="searchDisabled ? 'Maximum number reached' : `Add up to 5 tracks`"
      :search-category="'Tracks'"
      :search-disabled="searchDisabled"
      @search-results="handleSearchResults"
      @search-results-loading="(newSearchLoading: boolean) => searchLoading = newSearchLoading"
      @search-focused="(newSearchFocused: boolean) => searchFocused = newSearchFocused"
      style="width: 80%; margin-right: 10px;"
    />

    <div class="drawer-container">
      <Drawer>
        <DrawerTrigger>
          <img src="@/assets/list.svg" alt="Settings Drawer">
        </DrawerTrigger>
        <DrawerContent>
          <VisuallyHidden>
            <DrawerHeader>
              <DrawerTitle />
              <DrawerDescription>Settings</DrawerDescription>
            </DrawerHeader>
          </VisuallyHidden>
          <DrawerSettings />
        </DrawerContent>
      </Drawer>
    </div>

    <!-- Search Results -->
    <div class="search-results" v-if="searchResults && searchFocused">
      <div class="tracks-results" v-if="searchResults?.tracks">
        <div 
          class="search-result-card" 
          v-for="(track) in searchResults.tracks.items" 
          :key="track.id"
          @click="recommendationStore.addTrackTag(track)"
        >
          <img :src="track.album.images[1]?.url" class="card-img" alt="Track Image">
          <div class="card-info">
            <span class="result-title">{{ truncateString(track.name, 25) }}</span>
            <span class="result-subtitle">
              <i 
                v-if="track.explicit"
                class="bi bi-explicit-fill"
                style="margin-right: 2px;"
                aria-hidden="true"
              ></i>
              {{ truncateString(track.artists[0].name, 30) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  padding-top: 20px;
  display: flex;
  flex-direction: row;
}

/* Settings drawer */
.drawer-container {
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

.drawer-container img {
  height: 40px;
  margin-top: 2px;
}

/* Search Results */
.search-results {
  background-color: white;
  position: absolute;
  top: calc(var(--search-element-top) + var(--search-element-height) + 8px);
  left: calc(var(--search-element-left) - 5px);
  width: calc(var(--search-element-width) + 5px);

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
  margin-left: 15px; 
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
  font-size: 0.75rem;
  font-weight: 550;
}
</style>
