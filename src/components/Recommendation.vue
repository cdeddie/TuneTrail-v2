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
    <div><span class="title">TuneTrail</span></div>
    <div class="subtitle">
      <span>Discover new music using</span>
      <a href="https://open.spotify.com/" target="_blank">
        <img class ="spotify-img" src="/Spotify_logo_with_text.webp" alt="Spotify">
      </a>
    </div>

    <SearchSpotify @update-tags="handleUpdateTags" :pTags="tags" @search-focused="handleSearchFocused" style="margin-top: 2vh;" />
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 7em; 
  font-weight: bold;
  text-align: center;
  line-height: 0.9;

  color: rgb(74,113,253);
}

.subtitle {
  margin-top: .25vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 550;
  color: white;
}

.subtitle a
.subtitle img {
  display: inline-block;
  max-width: 100%;
}

.spotify-img {
  padding-left: 8px;
  padding-right: 5px;
  height: 1.4em;
  font-size: 1.4em;
  min-width: calc(1.6em * 2.4);

  filter: hue-rotate(100deg);
}

.subtitle span {
  margin-bottom: 3px;
  font-size: 1.4em;
}
</style>