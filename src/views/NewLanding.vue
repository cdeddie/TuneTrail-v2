<script setup lang="ts">
import { ref, onMounted }     from 'vue';
import { getRandomAlbums }    from '@/utils/importImages';
import LandingSearch          from '@/components/FloatingLabelSearch.vue';

const albums = ref<ReturnType<typeof getRandomAlbums>>([]);

onMounted(() => {
  albums.value = getRandomAlbums(100);
});

const getAlbumsForLevel = (levelIndex: number) => {
  const albumsPerLevel = 20;
  const start = levelIndex * albumsPerLevel;
  return [...albums.value.slice(start, start + albumsPerLevel), ...albums.value.slice(start, start + albumsPerLevel)];
};
</script>

<template>
  <div class="landing-page">
    <div v-for="(_, index) in 5" :key="index" class="carousel-level" :class="`level-${index + 1}`">
      <div class="carousel-track" :class="{ reverse: index % 2 === 1 }" :style="{ animationDuration: `${(index % 2 === 0 ? 40 : 80)}s` }">
        <div v-for="album in getAlbumsForLevel(index)" :key="album.link" class="album-item">
          <a target="_blank">
            <img :src="album.image" alt="Album cover" loading="lazy" />
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="landing-content">
    <h1 class="gradient-tet">TuneTrail</h1>
    <LandingSearch 
      :placeholder="'Search for a song to discover more'" 
      :search-category="'tracks'"
      :search-disabled="false"
      :background-colour="'black'"
      style="margin: 20px;"
    />
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
  top: 20.5%;
  left: 30vw;
  background-color: black;
  box-shadow: 0 0 5px 10px black;
  border-radius: 1rem;
}

h1 {
  font-size: 5vw;
  font-weight: 800;
  text-align: center;
  color: var(--secondary-colour);
}

.gradient-text {
  background: linear-gradient(to right, rgb(30, 215, 96), rgb(43, 196, 233));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>