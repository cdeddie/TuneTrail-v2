// recommendationStore.ts
import { defineStore } from 'pinia';
import { RecommendationFilter } from '@/types/RecommendationType';
import { computed, reactive, ref, watch } from 'vue';
import { Tag, createArtistTag, createTrackTag } from '@/types/TagType';
import { useAuthStore } from './authStore';
import { fetchRecommendations } from '@/utils/fetchSpotifyRecommendations';
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/localStorageUtils';

export const useRecommendationStore = defineStore('RecommendationStore', () => {
  const authStore = useAuthStore();

  // -------- TAGS -------- //
  const activeCategory = ref<string>('Tracks');

  const trackTags = ref<Tag[]>([]);
  const savedTrackTags = loadFromLocalStorage<Tag[]>('trackTags');
  if (savedTrackTags) {
    trackTags.value = savedTrackTags;
  }

  const artistTags = ref<Tag[]>([]);
  const savedArtistTags = loadFromLocalStorage<Tag[]>('artistTags');
  if (savedArtistTags) {
    artistTags.value = savedArtistTags;
  }

  const addTrackTag = async (track: SpotifyApi.TrackObjectFull) => {
    const tag = await createTrackTag(track);

    if (trackTags.value.some((t) => t.id === tag.id)) return;

    trackTags.value.push(tag);
  };

  const addArtistTag = async (artist: SpotifyApi.ArtistObjectFull) => {
    const tag = await createArtistTag(artist);

    if (artistTags.value.some((t) => t.id === tag.id)) return;

    artistTags.value.push(tag);
  };

  const removeTrackTag = (tag: Tag) => {
    trackTags.value = trackTags.value.filter((t) => t.id !== tag.id);
  };

  const removeArtistTag = (tag: Tag) => {
    artistTags.value = artistTags.value.filter((t) => t.id !== tag.id);
  };

  // -------- FILTERS -------- //
  const filterState = reactive<RecommendationFilter>({
    popularity: null,
    energy: null,
    happiness: null,
    danceability: null,
  });

  // Load filterState from storage if available
  const savedFilterState = loadFromLocalStorage<RecommendationFilter>('filterState');
  if (savedFilterState) {
    Object.assign(filterState, savedFilterState);
  }

  const updateFilterValue = (key: keyof RecommendationFilter, value: string | null) => {
    if (value === 'High') {
      filterState[key] = 100;
    } else if (value === 'Low') {
      filterState[key] = 0;
    } else {
      filterState[key] = null;
    }
  };

  // -------- RECOMMENDATIONS -------- //
  // Note that all recommendations responses will be tracks
  const trackRecommendations = ref<SpotifyApi.RecommendationsObject>();
  const savedTrackRecommendations = loadFromLocalStorage<SpotifyApi.RecommendationsObject>('trackRecommendations');
  if (savedTrackRecommendations && trackTags.value.length > 0) {
    trackRecommendations.value = savedTrackRecommendations;
  }

  const artistRecommendations = ref<SpotifyApi.RecommendationsObject>();
  const savedArtistRecommendations = loadFromLocalStorage<SpotifyApi.RecommendationsObject>('artistRecommendations');
  if (savedArtistRecommendations && artistTags.value.length > 0) {
    artistRecommendations.value = savedArtistRecommendations;
  }

  const recommendationDataLoading = ref<boolean>(false);

  // Tracks the tags of the current activeCategory
  const currentTags = computed(() => {
    if (activeCategory.value === 'Tracks') {
      return trackTags.value;
    } else if (activeCategory.value === 'Artists') {
      return artistTags.value;
    } else {
      return [];
    }
  });

  const currentRecommendations = computed(() => {
    if (activeCategory.value === 'Tracks') {
      return trackRecommendations.value;
    } else if (activeCategory.value === 'Artists') {
      return artistRecommendations.value;
    } else {
      return null;
    }
  });

  // -------- WATCHERS -------- //
  watch(artistTags, async (newTags) => {
    if (newTags.length === 0) return;
    recommendationDataLoading.value = true;
    try {
      const result = await fetchRecommendations(newTags, filterState, authStore.isLoggedIn, 50);
      if (!result) return;
      artistRecommendations.value = result;
    } finally {
      recommendationDataLoading.value = false;
    }
  }, { deep: true });

  watch(trackTags, async (newTags) => {
    if (newTags.length === 0) return;
    recommendationDataLoading.value = true;
    try {
      const result = await fetchRecommendations(newTags, filterState, authStore.isLoggedIn, 50);
      if (!result) return;
      trackRecommendations.value = result;
    } finally {
      recommendationDataLoading.value = false;
    }
  }, { deep: true });

  watch(filterState, async () => {
    if (currentTags.value.length === 0) return;
    recommendationDataLoading.value = true;
    try {
      const result = await fetchRecommendations(currentTags.value, filterState, authStore.isLoggedIn, 50);
      if (!result) return;
      if (activeCategory.value === 'Tracks') {
        trackRecommendations.value = result;
      } else if (activeCategory.value === 'Artists') {
        artistRecommendations.value = result;
      }
    } finally {
      recommendationDataLoading.value = false;
    }
  }, { deep: true });

  // -------- PERSISTENCE -------- //
  // Tags Persistence
  watch(trackTags, (newVal) => {
    saveToLocalStorage('trackTags', newVal);
  }, { deep: true });

  watch(artistTags, (newVal) => {
    saveToLocalStorage('artistTags', newVal);
  }, { deep: true });

  // Filters Persistence
  watch(filterState, (newVal) => {
    saveToLocalStorage('filterState', newVal);
  }, { deep: true });

  // Recommendations Persistence
  watch(trackRecommendations, (newVal) => {
    if (newVal) {
      saveToLocalStorage('trackRecommendations', newVal);
    } else {
      localStorage.removeItem('trackRecommendations');
    }
  }, { deep: true });

  watch(artistRecommendations, (newVal) => {
    if (newVal) {
      saveToLocalStorage('artistRecommendations', newVal);
    } else {
      localStorage.removeItem('artistRecommendations');
    }
  }, { deep: true });

  watch(recommendationDataLoading, (newVal) => {
    saveToLocalStorage('recommendationDataLoading', newVal);
  });

  // -------- ACTIONS -------- //
  return {
    activeCategory,
    currentTags,
    trackTags,
    addTrackTag,
    addArtistTag,
    removeTrackTag,
    removeArtistTag,
    filterState,
    updateFilterValue,
    trackRecommendations,
    artistRecommendations,
    currentRecommendations,
    recommendationDataLoading
  }
});
