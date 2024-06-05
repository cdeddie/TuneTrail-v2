<script setup lang="ts">
import { ref } from 'vue';
import SearchSpotify from './SearchSpotify.vue';
import { Tag } from '../types/TagType';
import RecommendationFilters, { SliderItem } from './RecommendationFilters.vue';
import CardSlider from './CardSlider.vue';

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

const tags = ref<Tag[]>([]);
const filters = ref<SliderItem[]>([]);
const searchFocused = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const recommendations = ref<any>();

const handleUpdateTags = (newTags: Tag[]) => {
  tags.value = newTags;
};

const handleSearchFocused = (inputFocused: boolean) => {
  searchFocused.value = inputFocused;
};

const handleUpdateFilters = (newFilters: SliderItem[]) => {
  filters.value = newFilters;
};

const publicFetchRecommendations = async() => {
  isLoading.value = true;

  try {
    // Construct a string of tag ids
    const tagQuery = encodeURIComponent(tags.value.map((tag: Tag) => tag.id).join(','));
    // Construct a string of recommendations
    let recTargetString = '';
    for (let i = 0; i < filters.value.length; i++) {
      if (filters.value[i].value[0] > 0) {
        let temp = filters.value[i].name + '=' + filters.value[i].value[0] + ',';
        recTargetString += temp;
      }
    }
    recTargetString = recTargetString.substring(0, recTargetString.length - 1);
    const recTargetQuery = encodeURIComponent(recTargetString);
    const limit = 50;
    const seedType = tags.value[0]?.type;

    const url = `${baseUrl}/public-recommendations?limit=${limit}&tags=${tagQuery}&recTargets=${recTargetQuery}&seedType=${seedType}`;
    const response = await fetch(url, { credentials: 'include' });
    console.log(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: any = await response.json();

    recommendations.value = data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    isLoading.value = false;
  }
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
    <button  @click="publicFetchRecommendations" style="color: white;">Butt </button>
    <CardSlider :p-recommendations="recommendations" :p-is-loading="isLoading" />
    
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