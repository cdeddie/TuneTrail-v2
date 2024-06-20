<script setup lang="ts">
import { ref } from 'vue';
import SearchSpotify from './SearchSpotify.vue';
import { Tag } from '../types/TagType';

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

const tags = ref<Tag[]>([]);
const searchFocused = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const recommendations = ref<any>();

const handleUpdateTags = (newTags: Tag[]) => {
  tags.value = newTags;
};

const handleSearchFocused = (inputFocused: boolean) => {
  searchFocused.value = inputFocused;
};

const publicFetchRecommendations = async() => {
  isLoading.value = true;

  try {
    // Construct a string of tag ids
    const tagQuery = encodeURIComponent(tags.value.map((tag: Tag) => tag.id).join(','));
    // Construct a string of recommendations
    let recTargetString = '';

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


</template>

<style scoped>


</style>