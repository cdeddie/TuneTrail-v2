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

  cards.forEach((card) => {
    (card as HTMLElement).style.width = `${maxWidth.value}px`;
    (card as HTMLElement).style.height = `${maxHeight.value}px`;
  });
};

onMounted((): void => {
  updateCardDimensions();
  window.addEventListener('resize', updateCardDimensions);

  // Transition observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  });

  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el) => observer.observe(el));
});

import ChartCard from './ChartCard.vue';
</script>

<template>
  <div class="cards-container">
    <ChartCard
      class="chart-card hidden"
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
      class="chart-card hidden"
      :pRank="2"
      pImgSrc="https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676"
      pLocation="Global"
      pSongTitle="Cruel Summer"
      pSongArtist="Taylor Swift"
      pPrimaryColour="rgba(0,100,80,0.8)"
      pSecondaryColour="rgb(255,255,255)"
      pSecondaryColourA="rgba(255,255,255, 0.5)"
    />

    <ChartCard 
      class="chart-card hidden"
      :pRank="3"
      pImgSrc="https://i.scdn.co/image/ab67616d0000b273659cd4673230913b3918e0d5"
      pLocation="Global"
      pSongTitle="Espresso"
      pSongArtist="Sabrina Carpenter"
      pPrimaryColour="rgba(36, 66, 60,0.8)"
      pSecondaryColour="rgb(245, 239, 236)"
      pSecondaryColourA="rgba(245, 239, 236, 0.8)"
    />
  </div>


</template>

<style scoped>
.cards-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.chart-card {
  
}

.cards-container > * {
  margin: 0px 10px;
}

.hidden {
  opacity: 0;
  filter: blur(3px);
  transform: translateX(-100%);
  transition: all 2s;
  margin: 5vh;
}

.show {
  opacity: 1;
  filter: blur(0);
  transform: translateX(0);
}

@media (prefers-reduced-motion) {
  .hidden {
    transition: none;
  }
}

.chart-card:nth-child(2) {
  transition-delay: 200ms;
}

.chart-card:nth-child(3) {
  transition-delay: 400ms;
}

.chart-card:nth-child(4) {
  transition-delay: 600ms;
}
</style>  