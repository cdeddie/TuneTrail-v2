<script setup lang="ts">
import { ref, watch }             from 'vue';
import LandingSearch              from '@/components/FloatingLabelSearch.vue';
import { useColourThemeStore }    from '@/stores/colourThemeStore';
import { truncateString }         from '@/utils/stringProcessing';
import { getRandomAlbums }        from '@/utils/importImages';
import { useRouter }              from 'vue-router';
import { Tag, createTag }         from '@/types/TagType';

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

// Album slider
const albums = getRandomAlbums(40);
const mid = Math.ceil(albums.length / 2);
const albumsFirst = albums.slice(0, mid);
const albumsSecond = albums.slice(mid);

const albumsSlide = ref<HTMLElement | null>(null);

// Redirect to /discover page
const router = useRouter();

const navigateToTarget = async (track: any) => {
  const tag: Tag = await createTag(track);

  router.push({ 
    path: '/discover',
    query: { tag: JSON.stringify(tag) }
  });
};
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
                  @click="navigateToTarget(track)" 
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

      <div class="albums-container">
        <div class="albums">
          <div class="albums-slide" ref="albumsSlide">
            <img v-for="(album) in albumsFirst" :src="album.image">
            <img v-for="(album) in albumsFirst" :src="album.image">
          </div>
        </div>

        <div class="albums">
          <div class="albums-slide right" ref="albumsSlide">
            <img v-for="(album) in albumsSecond" :src="album.image">
            <img v-for="(album) in albumsSecond" :src="album.image">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-mobile {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 5%;
}

.landing-content {
  display: flex;
  flex-direction: column;
  height: 100%;
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
  flex-direction: column;
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
  font-size: 3.8vw;
}

.result-subtitle {
  font-size: .75rem;
  font-weight: 550;
}

/* ----- Hero text ----- */
.hero-text {
  margin: 20px;
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
  font-size: 2.1rem;
  font-weight: 800;
  color: white;
  line-height: 1.3;
}

/* ----- Album Slider ----- */
@keyframes slide-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-1 * (20 * 12.5vh + 20 * 20px)));
  }
}

@keyframes slide-right {
  from {
    transform: translateX(calc(-1 * (20 * 12.5vh + 20 * 20px)));
  }
  to {
    transform: translateX(0);
  }
}

.albums-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-evenly;
}

.albums {
  overflow: hidden;
  position: relative;
}

.albums-slide {
  display: flex;
  flex-direction: row;
  animation: 20s slide-left infinite linear;
}

.right {
  display: flex;
  flex-direction: row;
  animation: 22.5s slide-right infinite linear;
}

.albums-slide img {
  height: 12.5vh;
  width: 12.5vh;
  margin: 0 10px;
}
</style>