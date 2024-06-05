<script setup lang="ts">
import { ref, computed } from 'vue';
import { getAverageColour } from '@/types/TagType';

const props = defineProps<{ pRecommendationItem: any; }>();

console.log(props.pRecommendationItem?.album.images[0].url);
const backgroundColour = computed(async() => {
  const promise = getAverageColour(props.pRecommendationItem?.album.images[0].url);
  return promise.then(color => color);
});
console.log(backgroundColour.value);

</script>

<template>
  <div class="card-root" :style="{ 'backgroundColor': `${backgroundColour}` }">
    <div>{{ props.pRecommendationItem?.name }}</div>
    <div>Hello</div>
  </div>

</template>

<style scoped>
.card-root {
  color: white;
  border: solid 1px red;
}
.item-image {
  height: 50vh;
}

</style>