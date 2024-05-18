<script setup lang="ts">
import { ref, onMounted } from 'vue';

const maxHeight = ref<number>(0);
const maxWidth = ref<number>(0);

const updateCardDimensions = (): void => {
  maxWidth.value = 0;
  maxHeight.value = 0;

  const cards = document.querySelectorAll('.chart-card');
  cards.forEach((card) => {
    const width = card.clientWidth;
    const height = card.clientHeight;
    if (width > maxWidth.value) {
      maxWidth.value = width+1;
    }
    if (height > maxHeight.value) {
      maxHeight.value = height+1;
    }
  });

  console.log(maxWidth.value);
  console.log(maxHeight.value);

  cards.forEach((card) => {
    (card as HTMLElement).style.width = `${maxWidth.value}px`;
    (card as HTMLElement).style.height = `${maxHeight.value}px`;
  });
};

onMounted((): void => {
  updateCardDimensions();
  window.addEventListener('resize', updateCardDimensions);
});

import ChartCard from './ChartCard.vue';
</script>

<template>
  <div class="cards-container">
    <ChartCard
      class="chart-card"
      :pRank="1"
      pImgSrc="https://i.scdn.co/image/ab67616d00001e02ce31aff39a003828576d3930"
      pLocation="Global"
      pSongTitle="Million Dollar Baby"
      pSongArtist="Tommy Richman"
      pPrimaryColour="rgba(245, 239, 236, 0.8)"
      pSecondaryColour="rgb(21, 156, 100)"
      pSecondaryColourA="rgba(21, 156, 100, 0.5)"
    />

    <ChartCard 
      class="chart-card"
      :pRank="2"
      pImgSrc="https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676"
      pLocation="Global"
      pSongTitle="Cruel Summer"
      pSongArtist="Taylor Swift"
      pPrimaryColour="rgba(0,100,80,0.8)"
      pSecondaryColour="rgb(255,255,255)"
      pSecondaryColourA="rgba(255,255,255, 0.5)"
    />

  </div>


</template>

<style scoped>
.cards-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.cards-container > * {
  margin: 0px 10px;
}
</style>