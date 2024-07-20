<script setup lang="ts">
import { ref, watch, onMounted }        from 'vue';
import { useRoute }                     from 'vue-router';
import DiscoverSearch                   from '@/components/FloatingLabelSearch.vue';
import { Tag, createTag }               from '@/types/TagType';
import { useRecommendationFilterStore } from '@/stores/recommendationFilterStore';
import { fetchRecommendations }         from '@/utils/fetchSpotifyRecommendations';
import { pickBWTextColour }             from '@/utils/colourStyle';
import { truncateString }               from '@/utils/stringProcessing';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const searchCategory = ref<string>('Tracks');
const searchResults = ref<any>();
const searchLoading = ref<boolean>(false);
const searchFocused = ref<boolean>(false);
const searchDisabled = ref<boolean>(false);

const searchElement = ref<InstanceType<typeof DiscoverSearch> | null>(null);

// Tag handling
const tags = ref<Tag[]>([]);

const addTag = async(item: any) => {
  const tag = await createTag(item);

  if (tags.value.some((t) => t.id === tag.id)) {
    return;
  }

  tags.value.push(tag);
};

const removeTag = (tag: Tag) => {
  tags.value = tags.value.filter((t) => t.id !== tag.id);
};

watch(tags, (newTags) => {
  searchDisabled.value = newTags.length >= 5;
}, { immediate: true, deep: true });

// Recommendation handling
const store = useRecommendationFilterStore();
const filterState = store.filterState;

const recommendationResults = ref<any>();
const recommendationDataLoading = ref<boolean>(false);

watch(() => [...tags.value], async (newTags) => {
  recommendationDataLoading.value = true;
  try {
    recommendationResults.value = await fetchRecommendations(newTags, filterState);
  } finally {
    recommendationDataLoading.value = false;
  }
}, { deep: true });

watch(filterState, async () => {
  recommendationDataLoading.value = true;
  try {
    recommendationResults.value = await fetchRecommendations(tags.value, filterState);
  } finally {
    recommendationDataLoading.value = false;
  }
}, { deep: true });

// Utils
const convertRgbToRgba = (rgb: string, opacity: number): string => {
  const [r, g, b] = rgb.slice(4, -1).split(',').map(Number);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Handling query from landing page
const route = useRoute();
const landingTag = ref<Tag>();

onMounted(() => {
  if (route.query.tag) {
    try {
      landingTag.value = JSON.parse(route.query.tag as string);
      if (landingTag.value) {
        tags.value.push(landingTag.value);
      }
    } catch (e) {
      console.error('Failed to parse tag from query:', e);
    }
  }
});
</script>

<template>
  <div class="discover-mobile">
    <div class="search-container">
      <DiscoverSearch 
        ref="searchElement"
        :placeholder="searchDisabled ? 
                      'Maximum number reached' 
                      : `Add up to 5 ${searchCategory}`"
        :search-category="searchCategory"
        :search-disabled="searchDisabled"
        @search-results="(newSearchResults: any) => searchResults = newSearchResults"
        @search-results-loading="(newSearchLoading: boolean) => searchLoading = newSearchLoading"
        @search-focused="(newSearchFocused: boolean) => searchFocused = newSearchFocused"
        style="width: 80%; margin-right: 10px;"
      />

      <div class="drawer-container">
        <Drawer class="drawer-parent">
          <DrawerTrigger>
            <img src="@/assets/list.svg">
          </DrawerTrigger>
          <DrawerContent>
            <div class="drawer-content">
              <span>Hello!</span>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>

    <div class="search-results" v-if="searchResults && searchFocused">
      <div class="tracks-results" v-if="searchResults?.tracks">
        <div 
          class="search-result-card" 
          v-for="(track) in searchResults.tracks?.items"
          @click="addTag(track)"
        >
          <img :src="track.album.images[1]?.url" class="card-img">
          <div class="card-info">
            <span class="result-title">{{ track.name }}</span>
            <span class="result-subtitle">
              <i 
                v-if="track.explicit"
                class="bi bi-explicit-fill"
                style="margin-right: 2px;"
              ></i>
              {{ truncateString(track.artists[0].name, 30) }}
            </span>
          </div>
        </div>
      </div>

      <div class="artists-results" v-else-if="searchResults?.artists">
        <div 
          class="search-result-card" 
          v-for="(artist) in searchResults.artists?.items"
          @click="addTag(artist)"
        >
          <img v-if="artist.images[0]" :src="artist.images[1]?.url" class="card-img">
          <i v-else class="bi bi-person-fill img-alt"></i>
          <div class="card-info">
            <span class="result-title">{{ truncateString(artist.name, 30) }}</span>
            <span class="result-subtitle">{{ artist.genres[0] }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tag-parent">
      <div 
        v-for="(tag) in tags" 
        :key="tag.id" 
        class="tag-container" 
        :style="{ backgroundColor: convertRgbToRgba(tag.colour, 0.5) }"
      >
        <img v-if="tag.image != ''" :src="tag.image">
        <span v-if="tag.image != ''" :style="{ color: pickBWTextColour(tag.colour) }">{{ tag.name }}</span>
        <i v-else class="bi bi-person-fill img-alt"></i>
        <i 
          class="fa fa-times-circle"
          aria-hidden="true" 
          @click="removeTag(tag)"
          :style="{ color: pickBWTextColour(tag.colour) }"
        ></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
}

/* Settings drawer */
.drawer-container {
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

.drawer-container img {
  height: 40px;
  margin-top: 2px;
}

.drawer-content {
  height: 20vh;
  color: white;
  filter: brightness(1);
}

/* Search Results */
.search-results {
  background-color: white;
  margin-top: calc(var(--search-element-top) - 5px);
  position: absolute;
  left: calc(var(--search-element-left));
  width: calc(var(--search-element-width));

  border-radius: 1rem;
  z-index: 1111;

  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
  height: fit-content;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.search-result-card {
  height: 7.5vh;
  display: flex;
  flex-direction: row;
  
  padding: 5px 10px;
  align-items: center;
  background-color: #D9D9D9;
  background-clip: content-box;
  border-radius: 1.35rem;
  transition: transform 0.3s ease;
}

.search-result-card:hover {
  transform: scale(1.01);
  cursor: pointer;
}

.search-result-card:first-child {
  padding-top: 10px;
}

.search-result-card:last-child {
  padding-bottom: 10px;
}

.card-img {
  height: 4.5vh;
  margin-left: 25px; 
}

.img-alt {
  font-size: 2.5rem;
  margin-left: 25px;
}

.card-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  color: black;
}

.result-title {
  font-weight: 700;
  font-size: 1rem;
}

.result-subtitle {
  font-size: .75rem;
  font-weight: 550;
}

/* Tag styling */
.tag-parent {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: calc(var(--search-element-left));
}

.tag-container {
  margin-top: 10px;
  max-height: 5vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: .5rem;
  margin-right: 12px;

  animation: popout 1s ease;
  -webkit-animation: popout 1s ease;
}

@keyframes popout {
  from{transform:scale(0)}
  80%{transform:scale(1.2)}
  to{transform:scale(1)}
}

@-webkit-keyframes popout {
  from{-webkit-transform:scale(0)}
  80%{-webkit-transform:scale(1.2)}
  to{-webkit-transform:scale(1)}
}

.tag-container img {
  height: 5vh;
  border-radius: .5rem 0 0 .5rem;
}

.tag-container span {
  padding: 20px;
  font-size: .9rem;
  font-weight: 600;
}

.tag-container i {
  margin-right: 10px;
  font-size: 1.25rem;
}

.tag-container i:hover {
  cursor: pointer;
}
</style>