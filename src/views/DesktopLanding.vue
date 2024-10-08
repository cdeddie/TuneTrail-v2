<script setup lang="ts">
import { ref, watch }           from 'vue';
import LandingSearch            from '@/components/FloatingLabelSearch.vue';
import { getRandomAlbums }      from '@/utils/importImages';
import { useColourThemeStore }  from '@/stores/colourThemeStore';
import { truncateString }       from '@/utils/stringProcessing';
import { useRouter }            from 'vue-router';
import { Tag, createTag }       from '@/types/TagType';

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
    }, 2200);
  } else {
    searchResultsVisible.value = false;
    landingTitleVisible.value = true;
  }
});

// Album slider
const albums = getRandomAlbums(20);

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
  <main class="landing-root">
    <div class="landing-content">
      <h1>TuneTrail</h1>
      <div class="search-content">
        <LandingSearch 
          :placeholder="'Search for a song to discover more'" 
          :background-colour="searchBackground"
          :search-category="'tracks'"
          :search-disabled="false"
          @search-results="(newSearchResults: any) => handleFirstSearch(newSearchResults)"
          style="width: 70%; height: 7vh; margin-left: 40px;"
        />

        <div class="search-results">
          <Transition name="fade" mode="out-in">
            <div class="landing-result" v-if="!searchResultsVisible">
              <div class="animated-title">
                <div class="text-top" :class="{ 'loading-animation': !landingTitleVisible }">
                  <div :class="{ 'top-animation': !landingTitleVisible }">
                    <span>discover new tunes</span>
                    <span>with the help of</span>
                  </div>
                </div>
                <div class="text-bottom">
                  <div :class="{ 'bottom-animation': !landingTitleVisible }">old favourites!</div>
                </div>
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
            </div>
          </Transition>
        </div>

        <div class="spotify-logo"><i class="bi bi-spotify"></i></div>
      </div>
    </div>

    <div class="album-covers">
      <div class="album-slide">
        <a v-for="(album) in albums" :href="album.link"><img :src="album.image" class="album-cover"></a>
      </div>

      <div class="album-slide">
        <a v-for="(album) in albums" :href="album.link"><img :src="album.image" class="album-cover"></a>
      </div>
    </div>
    
  </main>
</template>

<style scoped>
.landing-root {
  padding: 5%;
  padding-top: 0;
  padding-bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100vh;
}

.landing-content {
  padding-top: 5%;
}

h1 {
  color: white;
  font-size: 5vw;
  font-weight: 800;
}

.search-content {
  padding-top: 40px;
  width: 60vw;
  height: 60vh;
  border-radius: .5rem;
  background-color: var(--secondary-colour);
  position: relative;
}

.spotify-logo {
  color: var(--primary-colour);
  font-size: 2.5vw;
  padding: 1rem;
  position: absolute;
  bottom: 0;
  right: 0;
}

/* ----- Search Results ----- */

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
  margin-left: 40px;
  width: 70%;
  margin-top: 2vh;
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

.landing-result {
  display: flex;
  flex-direction: column;
  color: white;
  font-weight: 800;
  font-size: 1rem;
  height: 30vh;
  margin-left: 40px;
  margin-top: 15vh;
}

@keyframes hideTopText {
  0% { transform: translate3d(0, 0, 0); }
  40%, 60% { transform: translate3d(0, 50%, 0); }
  100% { transform: translate3d(0, 100%, 0); }
}

@keyframes hideBottomText {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(0, -100%, 0); }
}

.animated-title {
  color: white;
  font-family: 'Archivo Black', Arial, sans-serif;
  font-weight: 900;
  height: 90vmin;
  top: 50%;
}

.animated-title > div {
  height: 50%;
  overflow: hidden;
  position: absolute;
  width: 100%;
}

.animated-title > div div {
  font-size: 4.8vmin;
  padding: 0.8vmin 0;
  position: absolute;
}

.animated-title > div div span {
  display: block;
}

.animated-title > div.text-top {
  border-bottom: 0.4vmin solid white;
  width: 70%;
  top: 0;
}

.top-animation {
  animation: hideTopText 1s;
}

.animated-title > div.text-top div {
  animation-delay: 0.5s;
  animation-fill-mode: forwards;
  bottom: 0;
  transform: translate(0, 0);
}

.animated-title > div.text-top div span:first-child {
  color: var(--primary-colour);
}

.animated-title > div.text-bottom {
  bottom: 0;
}

.bottom-animation {
  animation: hideBottomText 0.5s;
}

.animated-title > div.text-bottom div {
  animation-delay: 1.75s;
  animation-fill-mode: forwards;
  top: 0;
  transform: translate(0, 0);
}

/* ----- Album Img Slider ----- */
@keyframes slide {
  from {
    transform: translateY(0);
  } to {
    transform: translateY(-100%);
  }
}

.album-covers {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.album-slide {
  display: inline-block;
  animation: 45s slide infinite linear;
}

.album-slide img {
  width: 25vw;
  padding: 2vw;
}

.album-covers:hover .album-slide {
  animation-play-state: paused;
}

.album-cover {
  transition: transform 0.5s ease;
}

.album-cover:hover {
  transform: scale(1.02);
}

/* ----- RESPONSIVENESS ----- */
@media(min-width: 2000px) {
  .spotify-logo {
    font-size: 2vw;
  }
}

@media(max-width: 1650px) {
  .search-result-card {
    height: 8.5vh;
  }
}
</style>