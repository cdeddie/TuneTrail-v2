<script setup lang="ts">
import { ref } from 'vue';
import LandingSearch from '@/components/LandingSearch.vue';
import { fetchSearch } from '@/utils/fetchSpotifySearch';

const landingTitleVisible = ref<boolean>(true);

const handleFirstSearch = () => {
  landingTitleVisible.value = !landingTitleVisible.value;
};
</script>

<template>
  <main class="landing-root">
    <h1>TuneTrail</h1>
    <div class="search-content">
      <LandingSearch />

      <div class="search-results">
        <div class="landing-result">
          <div class="animated-title">
            <div class="text-top" :class="{ 'loading-animation': !landingTitleVisible }">
              <div :class="{ 'top-animation': !landingTitleVisible }">
                <span>discover new tunes</span>
                <span>with the help</span>
              </div>
            </div>
            <div class="text-bottom">
              <div :class="{ 'bottom-animation': !landingTitleVisible }">old favourites!</div>
            </div>
          </div>
        </div>
      </div>

      <div class="spotify-logo"><i class="bi bi-spotify" @click="handleFirstSearch"></i></div>
    </div>

  </main>

  <div class="album-cover-slider">


  </div>

</template>

<style scoped>
.landing-root {
  padding: 5%;
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

.search-results {

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
  font-family: Roboto, Arial, sans-serif;
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

.loading-animation {
  border-bottom: 0.4vmin solid black;
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

/* ----- RESPONSIVENESS ----- */
@media(min-width: 2000px) {
  .spotify-logo {
    font-size: 2vw;
  }
}

</style>