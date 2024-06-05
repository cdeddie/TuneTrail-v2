<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { getAverageColour } from '@/types/TagType';
import { pickBWTextColour } from '@/utils/colourStyle';
import RecommendationCard from './RecommendationCard.vue';

const items = ref<HTMLElement[]>([]);
const active = ref<number>(0);

const props = defineProps<{ 
  pRecommendations: any;
  pIsLoading: boolean;
 }>();

// JS source: https://codepen.io/hoanghodev/pen/eYxWjyW
const loadShow = async () => {
  if (items.value.length === 0 || !props.pRecommendations.tracks[active.value]) {
    return;
  }
  
  const backgroundColour = await getAverageColour(props.pRecommendations.tracks[active.value].album.images[0].url);
  console.log(backgroundColour);
  items.value[active.value].style.transform = 'none';
  items.value[active.value].style.zIndex = '1';
  items.value[active.value].style.filter = 'none';
  items.value[active.value].style.opacity = '0.8';
  items.value[active.value].style.color = pickBWTextColour(backgroundColour);
  items.value[active.value].style.backgroundColor = backgroundColour;

  let stt = 0;
  for (let i = active.value + 1; i < items.value.length; i++) {
    stt++;
    items.value[i].style.transform = `translateX(${120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(-1deg)`;
    items.value[i].style.zIndex = `-${stt}`;
    items.value[i].style.filter = 'blur(5px)';
    items.value[i].style.opacity = stt > 2 ? '0' : '0.6';
  }

  stt = 0;
  for (let i = active.value - 1; i >= 0; i--) {
    stt++;
    items.value[i].style.transform = `translateX(${-120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(1deg)`;
    items.value[i].style.zIndex = `-${stt}`;
    items.value[i].style.filter = 'blur(5px)';
    items.value[i].style.opacity = stt > 2 ? '0' : '0.6';
  }
};

const nextSlide = async() => {
  active.value = active.value + 1 < items.value.length ? active.value + 1 : active.value;
  await loadShow();
};

const prevSlide = async() => {
  active.value = active.value - 1 >= 0 ? active.value - 1 : active.value;
  await loadShow();
};

onMounted(async () => {
  await nextTick();
  items.value = Array.from(document.querySelectorAll('.slider .item')) as HTMLElement[];
  if (props.pRecommendations && !props.pIsLoading) {
    await loadShow();
  }
});

watch(() => [props.pRecommendations, props.pIsLoading],
  async ([newRecommendations, newIsLoading]) => {
    active.value = 0;
    if (newRecommendations && !newIsLoading) {
      await nextTick();
      items.value = Array.from(document.querySelectorAll('.slider .item')) as HTMLElement[];
      await loadShow();
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- <div class="slider-container" v-if="props.pRecommendations" >
    <div class="slider">
      <div v-for="item in props.pRecommendations.tracks" class="item" >
        <img class="card-img" :src="item.album.images[0].url">
        <span>{{ item.name }}</span>
      </div>

      <div class="button-container">
        <button id="next" @click="nextSlide">></button>
        <button id="prev" @click="prevSlide"><</button>
      </div>
    </div>
  </div> -->
  
  <RecommendationCard :p-recommendation-item="props.pRecommendations?.tracks[0]" style="margin-top: 20%;"/>
</template>

<style scoped>
.slider-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item {
  margin-bottom: 15vh;
  width: 26v;
  height: 40vh;
  position: absolute;
  transition:  0.5s;
  padding: 2%;
  text-align: center;
  border-radius: 1rem;
}

.button-container {
  margin-top: 5vh;
  display: flex;
  justify-content: center;
}

#next {
  margin-left: 3rem;
}

#prev {
  margin-right: 3rem;
}

#next, #prev {
  position: absolute;
  top: 75%;
  color: #d2d2d2;
  background: none;
  border: none;
  font-size: xxx-large;
  font-family: monospace;
  font-weight: bold;
  opacity: 0.8;
}

button:hover {
  cursor: pointer;
}

@media (min-width: 2000px) {
  .slider {
    height: 40vh;
  }
  .item {
    margin-top: 10vh;
    height: 15vh;
    width: 15vh;
  }

  #next {
    margin-top: 50px;
  }

  #prev {
    margin-top: 50px;
  }
} 

.card-img {
  border-radius: 1rem;
  max-height: 90%;
}

</style>