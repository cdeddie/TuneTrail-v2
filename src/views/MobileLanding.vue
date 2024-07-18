<script setup lang="ts">
import { ref, watch }           from 'vue';
import LandingSearch            from '@/components/FloatingLabelSearch.vue';
import { useColourThemeStore }  from '@/stores/colourThemeStore';
import { truncateString }       from '@/utils/stringProcessing';

const landingTitleVisible = ref<boolean>(true);

const handleFirstSearch = (newSearchResults: any) => {
  landingTitleVisible.value = false;
  searchResults.value = newSearchResults;
};

// Colour theme for search - requires secondary instead of primary
const themeStore = useColourThemeStore();
const searchBackground: string = themeStore.getSecondaryColour();

// Search handling
const searchResults = ref<any>();
const searchResultsVisible = ref<boolean>(false);

watch(searchResults, (newSearchResults) => {
  if (newSearchResults?.tracks) {
    setTimeout(() => {
      searchResultsVisible.value = true;
    }, 500);
  } else {
    searchResultsVisible.value = false;
    landingTitleVisible.value = true;
  }
});
</script>

<template>
  <div class="landing-mobile">
    <div class="landing-content">
      <h1>TuneTrail</h1>
      <div class="search-content">
        <LandingSearch 
          :placeholder="'Search for a song to discover more'" 
          :background-colour="searchBackground"
          :search-category="'tracks'"
          :search-disabled="false"
          @search-results="(newSearchResults: any) => handleFirstSearch(newSearchResults)"
        />

        <div class="search-results">
          <Transition name="fade" mode="out-in">
            <div class="hero-text" v-if="!searchResultsVisible">
              <div class="text-content">
                <span id="title">discover new tunes</span>
                <span>with the help of</span>
                <span>old favourites!</span>
              </div>
            </div>

            <div class="search-results-tracks" v-else-if="searchResultsVisible">
              <div class="tracks-results">
                <div 
                  class="search-result-card" 
                  v-for="(track) in searchResults.tracks?.items"
                  @click="" 
                >
                  <img :src="track.album.images[1]?.url" class="card-img">
                  <div class="card-info">
                    <span class="result-title">{{ truncateString(track.name, 25) }}</span>
                    <span class="result-subtitle">
                      <i 
                        v-if="track.explicit"
                        class="bi bi-explicit-fill"
                        style="margin-right: 2px;"
                      ></i>
                      {{ truncateString(track.artists[0].name, 20) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-mobile {
  padding: 5%;
}

.search-content {
  background-color: var(--secondary-colour);
  border-radius: .7rem;
  padding-top: 20px;
  height: 47vh;
}

h1 {
  color: white;
  font-size: 70px;
  font-weight: 800;
}

/* ----- Search Results ----- */

.search-results {
  display: flex;
  padding-bottom: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.search-results-tracks {
  background-color: white;
  border-radius: 1rem;
  margin: 10px 20px;
}

.search-result-card {
  height: 7.5vh;
  display: flex;
  flex-direction: row;
  min-width: 80vw;
  
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

/* Hero text */
.hero-text {
  margin: 7.5vh 20px;
  font-family: Roboto, Arial, sans-serif;
}

.text-content {
  display: flex;
  flex-direction: column;
}

#title {
  color: var(--primary-colour);
}

.text-content span {
  font-size: 32px;
  font-weight: 800;
  color: white;
  line-height: 1.3;
}
</style>