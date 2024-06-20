<script setup lang="ts">
import { ref } from 'vue';
import DiscoverSearch from '@/components/FloatingLabelSearch.vue';
import SwitchButton from '@/components/SwitchButton.vue';

const searchCategory = ref<string>('Tracks');
const searchResults = ref<any>();
const searchLoading = ref<boolean>(false);
const searchFocused = ref<boolean>(false);

const handleUpdateActive = (activeValue: string) => {
  
  searchCategory.value = activeValue;
};
</script>

<template>
  {{ searchFocused }}
  <div class="discover-root">
    <div class="search-container">
      <DiscoverSearch 
        :placeholder="`Add up to 5 ${searchCategory.toLocaleLowerCase()}`" 
        :background-colour="'#2D283E'"
        :search-category="searchCategory"
        @search-results="(newSearchResults: any) => searchResults = newSearchResults"
        @search-results-loading="(newSearchLoading: boolean) => searchLoading = newSearchLoading"
        @search-focused="(newSearchFocused: boolean) => searchFocused = newSearchFocused"
        style="width: 100%"
      />
      <SwitchButton 
        :left="'Tracks'" 
        :right="'Artists'" 
        class="search-category-button" 
        @update-active-value="handleUpdateActive"
      />
    </div>
  
    <div class="search-results" v-if="searchResults && searchFocused">
      <div class="tracks-results" v-if="searchResults?.tracks">
        <div class="track-card" v-for="(track, index) in searchResults.tracks?.items">
          <img :src="track.album.images[1]?.url" class="track-img">
          <div class="track-info">
            <span class="track-title">{{ track.name }}</span>
            <span class="track-artist">
              <i 
                v-if="track.explicit"
                class="bi bi-explicit-fill"
                style="margin-right: 2px;"
              ></i>
              {{ track.artists[0].name }}
            </span>
          </div>
        </div>
      </div>

      <div class="artists-results" v-else-if="searchResults?.artists">

      </div>
    </div>
  </div>

</template>

<style scoped>
.discover-root {

}

.search-container {
  margin-top: 3vh;
  margin-left: 25vw;
  margin-right: 25vw;

  display: flex;
  flex-direction: row;
  gap: 0;
}

.search-results {
  background-color: white;
  margin-top: 10px;
  margin-left: 35vw;
  margin-right: 35vw;

  border-radius: 1rem;
  z-index: 1111;

  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.track-card {
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

.track-card:hover {
  transform: scale(1.01);
  cursor: pointer;
}

.track-card:first-child {
  padding-top: 10px;
}

.track-card:last-child {
  padding-bottom: 10px;
}

.track-img {
  height: 4.5vh;
  margin-left: 25px; 
}

.track-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  color: var(--primary-colour);
}

.track-title {
  font-weight: 700;
  font-size: 1rem;
}

.track-artist {
  font-size: .75rem;
  font-weight: 550;
}
</style>