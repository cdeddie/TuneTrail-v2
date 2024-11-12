<script setup lang="ts">
import { ref, watch, onMounted }        from 'vue';
import { useRoute }                     from 'vue-router';
import DiscoverSearch                   from '@/components/FloatingLabelSearch.vue';
import RecommendationResults            from '@/components/DiscoverResults.vue';
import DrawerSettings                   from '@/components/DrawerSettings.vue'; 
import { Tag, createTag }               from '@/types/TagType';
import { useAuthStore }                 from '@/stores/authStore';
import { useRecommendationFilterStore } from '@/stores/recommendationFilterStore';
import { fetchRecommendations }         from '@/utils/fetchSpotifyRecommendations';
import { pickBWTextColour }             from '@/utils/colourStyle';
import { truncateString }               from '@/utils/stringProcessing';
import { VisuallyHidden }               from 'radix-vue';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { SpotifyRecommendationResponse } from '@/types/SpotifyRecommendationResponse';

const authStore = useAuthStore();

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

// RECOMMENDATION HANDLING
const store = useRecommendationFilterStore();
const filterState = store.filterState;

const recommendationResults = ref<SpotifyRecommendationResponse>({
  tracks: [],
  seeds: []
});
const recommendationDataLoading = ref<boolean>(false);

watch(() => [...tags.value], async (newTags) => {
  recommendationDataLoading.value = true;
  try {
    const result = await fetchRecommendations(newTags, filterState, authStore.isLoggedIn, 50);
    if (result) {
      recommendationResults.value = result;
    }
  } finally {
    recommendationDataLoading.value = false;
  }
}, { deep: true });

watch(filterState, async () => {
  recommendationDataLoading.value = true;
  try {
    const result = await fetchRecommendations(tags.value, filterState, authStore.isLoggedIn, 50);
    if (result) {
      recommendationResults.value = result;
    }
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
        <Drawer>
          <DrawerTrigger>
            <img src="@/assets/list.svg">
          </DrawerTrigger>
          <DrawerContent>
            <VisuallyHidden>
              <DrawerHeader>
                <DrawerTitle />
                <DrawerDescription>Settings</DrawerDescription>
              </DrawerHeader>
            </VisuallyHidden>
            <!-- The actual Drawer contents in <DrawerSettings /> -->
            <DrawerSettings />
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
            <span class="result-title">{{ truncateString(track.name, 25) }}</span>
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
            <span class="result-title">{{ truncateString(artist.name, 25) }}</span>
            <span class="result-subtitle">{{ artist.genres[0] }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tags-scroll-container">
      <div class="tag-parent">
        <div 
          v-for="(tag) in tags" 
          :key="tag.id" 
          class="tag-container" 
          :style="{ backgroundColor: convertRgbToRgba(tag.colour, 0.5) }"
        >
          <img v-if="tag.image != ''" :src="tag.image">
          <span v-if="tag.image != ''" :style="{ color: pickBWTextColour(tag.colour) }">{{ truncateString(tag.name, 15) }}</span>
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

    <RecommendationResults 
      :recommendation-data="recommendationResults" 
      :recommendation-data-loading="recommendationDataLoading"
    />
  </div>
</template>

<style scoped>
.search-container {
  padding-top: 20px;
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

/* Search Results */
.search-results {
  background-color: white;
  margin-top: 8px;
  position: absolute;
  left: calc(var(--search-element-left) - 5px);
  width: calc(var(--search-element-width) + 5px);

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
  margin-left: 15px; 
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
.tags-scroll-container {
  width: 100vw;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.tag-parent {
  display: inline-flex;
  flex-direction: row;
  margin-left: 4vw;
  margin-right: 4vw;
}

.tag-container {
  border: 1px solid white;
  min-width: fit-content;
  max-height: 5vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: .5rem;
  margin-top: 10px;
  margin-right: 10px;

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
  height: calc(5vh - 2px);
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