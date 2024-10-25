<script setup lang="ts">
import { ref, onMounted, computed }                               from 'vue';
import { getRandomAlbums, Album }                                 from '@/utils/importImages';
import { useRouter }                                              from 'vue-router';
import { Tag, createTag }                                         from '@/types/TagType';
import { truncateString }                                         from '@/utils/stringProcessing';
import { useDeviceStore }                                         from '@/stores/deviceStore';
import LandingSearch                                              from '@/components/FloatingLabelSearch.vue';

const albums = ref<Album[]>([]);

// Albums logic, including loading logic
const getAlbumsForLevel = (levelIndex: number) => {
  const albumsPerLevel = 20;
  const start = levelIndex * albumsPerLevel;
  return [...albums.value.slice(start, start + albumsPerLevel), ...albums.value.slice(start, start + albumsPerLevel)];
};

const progress = ref<number>(0);
const isLoading = ref<boolean>(true);
const isFontLoaded = ref<boolean>(false);

onMounted(async () => {
  await loadFont();
  albums.value = getRandomAlbums(100);
  await loadImages(albums.value);
  await new Promise(resolve => setTimeout(resolve, 500)); // Wait for progress bar to complete
  isLoading.value = false;
});

const loadImages = (albums: Album[]) => {
  let loadedImages = 0;
  const totalImages = albums.length;

  return new Promise<void>((resolve) => {
    albums.forEach((album) => {
      const img = new Image();
      img.src = album.image;
      img.onload = img.onerror = () => {
        loadedImages++;
        progress.value = (loadedImages / totalImages) * 100;
        if (loadedImages === totalImages) resolve();
      };
    });
  });
};

const loadFont = async () => {
  try {
    await document.fonts.load('1em "Plus Jakarta Sans"');
    isFontLoaded.value = true;
  } catch (error) {
    console.error('Font loading failed:', error);
    isFontLoaded.value = true; // Show text anyway if font loading fails
  }
};

// Search handling
const searchResults = ref<any>();
const searchResultsVisible = ref<boolean>(false);

const router = useRouter(); // For redirect to /discover

const navigateToTarget = async (track: any) => {
  const tag: Tag = await createTag(track);

  router.push({ 
    path: '/discover',
    query: { tag: JSON.stringify(tag) }
  });
};

// Truncating string length based on viewport model
const deviceStore = useDeviceStore();
const truncateLength = computed(() => {
  if (deviceStore.width < 330) {
    return 20;
  } else if (deviceStore.width < 380) {
    return 25;
  } else if (deviceStore.width < 430) {
    return 33;
  } 
  return 50;
});
</script>

<template>
  <Transition name="fade">
    <div id="loading-screen" v-if="isLoading">
      <div class="progress-content">
        <div class="spotify-credit" :class="{ 'font-loaded': isFontLoaded }">
          <div>Powered by&nbsp;</div>
          <img src="@/assets/spotify.svg">
        </div>
        <div id="progress-bar-container">
          <div id="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </Transition>

  <div class="landing-page">
    <!-- <div :style="circleStyle" class="circle" v-if="deviceStore.isDesktop"></div> -->
    <div v-for="(_, index) in 5" :key="index" class="carousel-level" :class="`level-${index + 1}`">
      <div class="carousel-track" :class="{ reverse: index % 2 === 1 }" :style="{ animationDuration: `${(index % 2 === 0 ? 40 : 80)}s` }">
        <div v-for="album in getAlbumsForLevel(index)" :key="album.link" class="album-item">
          <a target="_blank">
            <img :src="album.image" alt="Album cover" loading="lazy" />
          </a>
        </div>
      </div>
    </div>

    <div class="landing-content">
      <h1>TuneTrail</h1>
      <div class="search-container">
        <LandingSearch 
          :search-category="'tracks'"
          :search-disabled="false"
          :background-colour="'black'"
          @search-results="(newSearchResults: any) => searchResults = newSearchResults"
          @search-focused="(searchFocusedVal: boolean) => searchResultsVisible = searchFocusedVal"
          style="margin: 0px;"
        />
      </div>

      <div class="search-results">
        <div style="color: white;"></div>
          <Transition name="fade" mode="out-in">
            <div class="search-results-tracks" v-if="searchResults && searchResultsVisible">
              <div class="tracks-results">
                <div 
                  class="search-result-card" 
                  v-for="(track) in searchResults?.tracks.items"
                  @click="navigateToTarget(track)" 
                >
                  <img :src="track.album.images[1]?.url" class="card-img">
                  <div class="card-info">
                    <span class="result-title">{{ truncateString(track.name, truncateLength) }}</span>
                    <span class="result-subtitle">
                      <i 
                        v-if="track.explicit"
                        class="bi bi-explicit-fill"
                        style="margin-right: 2px;"
                      ></i>
                      {{ truncateString(track.artists[0].name, truncateLength) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Loading screen */
#loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11111;
}

.progress-content {
  position: absolute;
  top: 30%;
  width: 40%;
  display: flex;
  flex-direction: column;
}

.spotify-credit {
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  font-size: 2.8rem;
  font-weight: 550;
  margin-bottom: 10px;
  opacity: 0;
  transition: opacity 0.2s ease-in;
}

.spotify-credit.font-loaded {
  opacity: 100;
}

.spotify-credit img {
  height: 3.5rem;
  filter: brightness(0) saturate(100%) invert(92%) sepia(0%) saturate(7466%) hue-rotate(358deg) brightness(116%) contrast(107%);
}

#progress-bar-container {
  height: 5px;
  background-color: white;
  overflow: hidden;
}

#progress-bar {
  width: 0%;
  height: 100%;
  background-color:#1DB954;
  transition: width 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Landing */
.landing-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #000;
  overflow: hidden;
}

.carousel-level {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 20%;
  margin: 10px 0;
}

.carousel-track {
  display: flex;
  animation: scroll linear infinite;
}

.reverse {
  animation-direction: reverse;
}

.album-item {
  flex: 0 0 auto;
  height: 17.5vh;
  aspect-ratio: 1 / 1;
  margin-right: 15px;
}

.album-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  filter: grayscale(0%);
  transition: filter 2s ease;
}

.album-item img.colour {
  filter: grayscale(0%);
  transition: filter .5s ease;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}


/* Search bar */
.landing-content {
  position: absolute;
  width: 40vw;
  top: 7.5%;
  left: 50%;
  transform: translateX(-50%);
}

h1 {
  font-size: 9vw;
  font-weight: 900;
  text-align: center;
  cursor: default;
  color: white;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3),
               0 0 10px rgba(0, 0, 0, 0.3),
               0 0 15px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  background: linear-gradient(to right, rgb(30, 215, 96), rgb(43, 196, 233));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-container {
  background-color: black;
  box-shadow: 0 0 5px 10px black;
  border-radius: 1rem;
  padding: 5px;
}

/* Mouse circle */
.circle {
  position: fixed;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 1111;
}

/* Search results */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.search-results-tracks {
  position: absolute;
  width: calc(40vw + 10px);
  margin-top: 1.5vh;

  background-color: white;
  border-radius: 1rem;
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
  cursor: pointer;
  animation: breathing 1s ease-in-out infinite;
}

@keyframes breathing {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
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

/* Resposiveness */
@media (max-width: 1280px) {
  .search-result-card {
    height: 8.5vh;
  }

  .card-img {
    height: 5vh;
  }
}

@media (max-width: 1033px) {
  .album-item {
    height: 18vh;
    margin-right: 10px;
    margin-right: 2vh;
  }

  .album-item img {
    filter: grayscale(0%);
  }

  .landing-content {
    width: 80vw;
  }

  h1 {
    font-size: 18vw;
  }

  .search-container {
    margin: 0 40px;
  }

  .search-results-tracks {
    width: calc(80vw - 80px);
    margin-left: 40px;
  }

  .search-result-card {
    height: 7vh;
  }

  .result-title {
    font-size: 1.5rem;
  }

  .result-subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .album-item {
    height: 18vh;
    margin-right: 2vh;
  }

  .landing-content {
    width: 100vw;
    top: 12.5%;
  }

  h1 {
    color: white;
    font-size: 22vw;
    margin-bottom: 1vh;
  }

  .search-container {
    box-shadow: 0 0 5px 20px black;
    border-radius: .5rem;
    margin: 0 20px;
    padding: 5px;
  }

  .search-results-tracks {
    margin: 3vh 1.5vw;
    width: 97vw;
  }

  .search-result-card {
    height: 8.5vh;
  }

  .card-img {
    margin-left: 5vw;
  }

  .result-title {
    font-size: 1.2rem;
  }

  .result-subtitle {
    font-size: 1rem;
  }

  .progress-content {
    width: 90%;
  }
}
</style>