<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted }        from 'vue';
import { getRandomAlbums }                              from '@/utils/importImages';
import { useRouter }                                    from 'vue-router';
import { Tag, createTag }                               from '@/types/TagType';
import { truncateString }                               from '@/utils/stringProcessing';
import { useColourThemeStore }                          from '@/stores/colourThemeStore';
import LandingSearch                                    from '@/components/FloatingLabelSearch.vue';

const albums = ref<ReturnType<typeof getRandomAlbums>>([]);
let animationFrameId = ref<number | null>(null);

onMounted(() => {
  albums.value = getRandomAlbums(100);
  startUpdateLoop();
});

onUnmounted(() => {
  stopUpdateLoop();
});

const getAlbumsForLevel = (levelIndex: number) => {
  const albumsPerLevel = 20;
  const start = levelIndex * albumsPerLevel;
  return [...albums.value.slice(start, start + albumsPerLevel), ...albums.value.slice(start, start + albumsPerLevel)];
};

// Cursor circle
const mouseX = ref<number>(0);
const mouseY = ref<number>(0);

const secondaryColourRGB = ref<string>('');
const themeStore = useColourThemeStore();
const secondaryTheme: string = themeStore.getSecondaryColour();

const hexToRGB = (hex: string): string => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const updateCirclePos = (event: MouseEvent) => {
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
};

// Get the CSS variable value
onMounted(() => {
  console.log(secondaryTheme);
  secondaryColourRGB.value = hexToRGB(secondaryTheme);
  console.log(secondaryColourRGB.value)
});

// Reactive circle style with dynamic background
const circleStyle = computed(() => ({
  left: `${mouseX.value}px`,
  top: `${mouseY.value}px`,
  background: `radial-gradient(circle, rgba(${secondaryColourRGB.value}, 0.8) 0%, rgba(${secondaryColourRGB.value}, 0) 100%)`,
}));

// Possible optimisation: only operate on visible albums using intersection API.
// Would half the array size (but still only 50 vs 100)
const updateAlbum = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance = Math.sqrt(
    Math.pow(centerX - mouseX.value, 2) + Math.pow(centerY - mouseY.value, 2)
  );
  return distance <= 250;
};

const updateAlbumColours = () => {
  const albums = document.querySelectorAll('.album-item img');
  albums.forEach((album) => {
    if (album instanceof HTMLElement) {
      if (updateAlbum(album)) {
        album.classList.add('colour');
      } else {
        album.classList.remove('colour');
      }
    }
  });
};

const updateLoop = () => {
  updateAlbumColours();
  animationFrameId.value = requestAnimationFrame(updateLoop);
};

const startUpdateLoop = () => {
  if (animationFrameId.value === null) {
    updateLoop();
  }
};

const stopUpdateLoop = () => {
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
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
</script>

<template>
  <div class="landing-page" @mousemove="updateCirclePos">
    <div :style="circleStyle" class="circle" >
    </div>
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
          :placeholder="'Search for a song to discover more'" 
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
            <div class="search-results-tracks" v-if="searchResultsVisible">
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
    </div>
  </div>
</template>

<style scoped>
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
  filter: grayscale(95%);
  transition: filter .5s ease;
}

.album-item img.colour {
  filter: grayscale(0%);
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .album-item {
    height: 15vh;
    margin-right: 10px;
  }
}

@media (max-width: 480px) {
  .album-item {
    height: 12vh;
    margin-right: 8px;
  }
}

/* Search bar */
.landing-content {
  position: absolute;
  width: 40vw;
  top: 7.5%;
  left: 30vw;
}

h1 {
  font-size: 9vw;
  font-weight: 900;
  text-align: center;
  color: var(--secondary-colour);
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
</style>