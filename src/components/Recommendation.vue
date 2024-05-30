<script setup lang="ts">
import { ref } from 'vue';
import SearchSpotify from './SearchSpotify.vue';
import { Tag } from '../types/TagType';
import RecommendationFilters, { SliderItem } from './RecommendationFilters.vue';
import CardSlider from './CardSlider.vue';

const tags = ref<Tag[]>([]);
const filters = ref<SliderItem[]>([]);
const searchFocused = ref<boolean>(false);

const handleUpdateTags = (newTags: Tag[]) => {
  tags.value = newTags;
};

const handleSearchFocused = (inputFocused: boolean) => {
  searchFocused.value = inputFocused;
};

const handleUpdateFilters = (newFilters: SliderItem[]) => {
  filters.value = newFilters;
};
</script>

<template>
  <div class="recommendation-root">
    <div class="title">Recommendations</div>

    <SearchSpotify @update-tags="handleUpdateTags" :pTags="tags" @search-focused="handleSearchFocused" />
    <RecommendationFilters 
      v-model:pTags="tags" 
      :pSearchFocused="searchFocused" 
      @update-tags="handleUpdateTags" 
      @update-filters="handleUpdateFilters"
    />
    <!-- <CardSlider /> -->
    
  </div>

</template>

<style scoped>
.recommendation-root {
  min-height: 100vh;
}

.title {
  font-size: 5vw;
  font-weight: 700;
  color: rgba(43, 233, 157, 0.576);
  display: flex;
  justify-content: center;
}
</style>