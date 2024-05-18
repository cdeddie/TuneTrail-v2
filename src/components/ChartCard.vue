<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  pRank: number;
  pImgSrc: string;
  pLocation: string;
  pSongTitle: string;
  pSongArtist: string;
  pPrimaryColour: string;
  pSecondaryColour: string;
  pSecondaryColourA: string;
}>();

const formatDate = computed(() => {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const currentDate = new Date();
  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  return `${month} ${day}`;
});
</script>

<template>
  <div class="style-parent">
    <div class="card-container">
      <div class="title-container">
        <span>{{ props.pSongTitle }}</span>
        <span id="subtitle">{{ props.pLocation }}</span>
      </div>
      <div class="song-container">
        <img :src="props.pImgSrc">
        <div class="song-description">
          <span id="ranking">#{{ props.pRank }} {{ formatDate }}</span>
          <span id="song">{{ props.pSongTitle.toUpperCase() }}</span>
          <span>{{ props.pSongArtist }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.style-parent {
  --primary-color: v-bind(pPrimaryColour);
  --secondary-color: v-bind(pSecondaryColour);
  --secondary-color-a: v-bind(pSecondaryColourA);
}

.card-container {
  font-family: 'Trebuchet MS';
  display: flex;
  flex-direction: column;
  background-color: var(--primary-color);
  padding: 20px;
  transform-style: preserve-3d;
  transition: transform 0.3s ease-in-out, box-shadow 0.5s ease-in-out;
}

.card-container:hover {
  box-shadow: 0 5px 20px rgba(129, 129, 129, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  transform: scale(1.005);
  cursor: pointer;
}

.title-container {
  display: flex;
  flex-direction: column;
  font-size: 40px;
  font-weight: 650;
  margin-bottom: 60px;
}

.title-container span {
  color: var(--secondary-color);
}

#subtitle {
  font-size: 36px;
  color: var(--secondary-color-a);
}

img {
  width: 120px;
}

.song-container {
  display: flex;
  flex-direction: row;
}

.song-description {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  font-size: 1.5rem;
}

.song-description span {
  margin-bottom: 5px;
  color: var(--secondary-color);
}

#ranking {
  background-color: var(--secondary-color);
  margin-right: 50px;
  text-align: center;
  padding: 2px;
  padding-top: 0;
  color: var(--primary-color);
  font-size: 1.3rem;
  width: 10vw;
}

#song {
  font-weight: 550;
}
</style>