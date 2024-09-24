<script setup lang="ts">
import { ref, watch, onMounted }        from 'vue';
import { useRoute }                     from 'vue-router';
import DiscoverSearch                   from '@/components/FloatingLabelSearch.vue';
import SwitchButton                     from '@/components/SwitchButton.vue';
import UserFlow                         from '@/components/UserFlow.vue';
import RecommendationResults            from '@/components/RecommendationResults.vue';
import { Tag, createTag }               from '@/types/TagType';
import { pickBWTextColour }             from '@/utils/colourStyle';
import { useRecommendationFilterStore } from '@/stores/recommendationFilterStore';
import { fetchRecommendations }         from '@/utils/fetchSpotifyRecommendations';
import { truncateString }               from '@/utils/stringProcessing';
import { Skeleton }                     from '@/components/ui/skeleton';

const searchCategory = ref<string>('Tracks');
const searchResults = ref<any>();
const searchLoading = ref<boolean>(false);
const searchFocused = ref<boolean>(false);
const searchDisabled = ref<boolean>(false);

const albumImageLoaded = ref<boolean[]>([]);
const artistImageLoaded = ref<boolean[]>([]);

const searchElement = ref<InstanceType<typeof DiscoverSearch> | null>(null);

// Search handling
const processSearchResults = () => {
  if (searchResults.value.tracks.items) {
    albumImageLoaded.value = new Array(searchResults.value.tracks.items.length).fill(false);
  }
  if (searchResults.value.artists.items) {
    artistImageLoaded.value = new Array(searchResults.value.artists.items.length).fill(false);
  }
};

// Switch button handling
const handleUpdateActive = (activeValue: string) => {
  searchElement.value?.clearSearchQuery();
  searchCategory.value = activeValue;
  tags.value.length = 0;
};

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
    const result = await fetchRecommendations(newTags, filterState);
    if (result) {
      const { data } = result;
      recommendationResults.value = data;
    }
  } finally {
    recommendationDataLoading.value = false;
  }
}, { deep: true });

watch(filterState, async () => {
  recommendationDataLoading.value = true;
  try {
    const result = await fetchRecommendations(tags.value, filterState);
    if (result) {
      const { data } = result;
      recommendationResults.value = data;
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
  <div class="discover-root">
    <div class="search-container">
      <DiscoverSearch 
        ref="searchElement"
        :placeholder="searchDisabled ? 
                      'Maximum number reached' 
                      : `Add up to 5 ${searchCategory.toLowerCase()}`"
        :search-category="searchCategory"
        :search-disabled="searchDisabled"
        @search-results="(newSearchResults: any) => { searchResults = newSearchResults; processSearchResults(); }"
        @search-results-loading="(newSearchLoading: boolean) => searchLoading = newSearchLoading"
        @search-focused="(newSearchFocused: boolean) => searchFocused = newSearchFocused"
        style="width: 100%; margin-left: 40px;"
      />
      <SwitchButton 
        ref="switchElement"
        :left="'Tracks'" 
        :right="'Artists'" 
        class="search-category-button" 
        @update-active-value="handleUpdateActive"
      />
    </div>
  
    <div class="search-results" v-if="searchResults && searchFocused">
      <div v-if="searchLoading">
        <Skeleton class="search-skeleton"></Skeleton>
        <Skeleton class="search-skeleton"></Skeleton>
        <Skeleton class="search-skeleton"></Skeleton>
        <Skeleton class="search-skeleton"></Skeleton>
        <Skeleton class="search-skeleton"></Skeleton>
      </div>
      <div v-else class="finished-loading">
        <div class="tracks-results" v-if="searchResults?.tracks">
          <div 
            class="search-result-card" 
            v-for="(track, index) in searchResults.tracks?.items"
            :key="track.id"
            @click="addTag(track)"
          >
            <div class="img-placeholder" v-show="!albumImageLoaded[index]"></div>
            <img 
              :src="track.album.images[1]?.url" 
              class="card-img"
              @load="albumImageLoaded[index] = true"
              v-show="albumImageLoaded[index]"
            >
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
            v-for="(artist, index) in searchResults.artists?.items"
            @click="addTag(artist)"
          >
            <div class="img-placeholder" v-show="!artistImageLoaded[index]"></div>
            <img 
              v-if="artist.images[0]" 
              :src="artist.images[1]?.url" 
              class="card-img"
              @load="artistImageLoaded[index] = true"
              v-show="artistImageLoaded[index]"
            >
            <i v-else class="bi bi-person-fill img-alt"></i>
            <div class="card-info">
              <span class="result-title">{{ truncateString(artist.name, 30) }}</span>
              <span class="result-subtitle">{{ artist.genres[0] }}</span>
            </div>
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

    <UserFlow class="user-flow-parent" />
    <RecommendationResults 
      :recommendation-data="recommendationResults" 
      :recommendation-data-loading="recommendationDataLoading"
    />
  </div>
</template>

<style scoped>
.discover-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.search-container {
  margin-left: 25vw;
  margin-right: 25vw;
  padding-top: 3vh;
  display: flex;
  flex-direction: row;
  gap: 0;
}

.search-results {
  background-color: white;
  margin-top: calc(var(--search-element-top) + var(--search-element-height) + 10px);
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

.img-placeholder {
  height: 4.5vh;
  width: 4.5vh;
  background-color: #D9D9D9;
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
  margin-left: calc(var(--search-element-left));
  max-width: 50vw;
  flex-wrap: wrap;
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
}

.tag-container i:hover {
  cursor: pointer;
}

/* User flow styles */
.user-flow-parent {
  position: absolute;
  left: 87%;
  top: var(--search-element-top);
  height: var(--search-element-height);
  align-items: center;
}

/* Skeleton styles */
.search-skeleton {
  height: 7.5vh;
  display: flex;
  flex-direction: row;
  
  padding: 5px 10px;
  align-items: center;
  background-color: #D9D9D9;
  background-clip: content-box;
  border-radius: 1.35rem;
}

.search-skeleton:first-child {
  padding-top: 10px;
}

.search-skeleton:last-child {
  padding-bottom: 10px;
}

@media(max-width: 1000px) {
  .search-container {
    margin-left: 0;
  }
}

@media (max-width: 1300px) {
  .search-container {
    margin-top: 3vh;
    margin-left: 8vw;
    margin-right: 24vw;
  }

  .user-flow-parent {
    left: 81%;
  }

  .result-title {
    font-size: .9rem;
  }

  .result-subtitle {
    font-size: .65rem;
  }

  .search-result-card {
    height: 8vh;
  }

  .search-skeleton {
    height: 8vh;
  }
}

@media (max-width: 1500px) {
  .search-result-card {
    height: 9vh;
  }

  .search-skeleton {
    height: 9vh;
  }

  .card-img {
    height: 5.5vh;
  }

  .img-placeholder {
    height: 5.5vh;
    width: 5.5vh;
  }
}
</style>