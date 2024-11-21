import { defineStore }          from 'pinia';
import { RecommendationFilter } from '@/types/RecommendationType';
import { computed, reactive, ref, watch }             from 'vue';
import { Tag, createArtistTag, createTrackTag } from '@/types/TagType';
import { useAuthStore } from './authStore';
import { fetchRecommendations } from '@/utils/fetchSpotifyRecommendations';

export const useRecommendationStore = defineStore('RecommendationStore', () => {
  // -------- TAGS -------- //
  const activeCategory = ref<string>('Tracks');

  const trackTags = ref<Tag[]>([]);
  const artistTags = ref<Tag[]>([]);

  const addTrackTag = async(track: SpotifyApi.TrackObjectFull) => {
    const tag = await createTrackTag(track);

    if (trackTags.value.some((t) => t.id === tag.id)) return;

    trackTags.value.push(tag);
  };

  const addArtistTag = async(artist: SpotifyApi.ArtistObjectFull) => {
    const tag = await createArtistTag(artist);

    if (trackTags.value.some((t) => t.id === tag.id)) return;

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
  const artistRecommendations = ref<SpotifyApi.RecommendationsObject>();

  const recommendationDataLoading = ref<boolean>(false);
  const authStore = useAuthStore();

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
      return [];
    }
  });

  watch(artistTags, async(newTags) => {
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
  
  watch(trackTags, async(newTags) => {
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

  // Supposedly, this does not require a 'newFilterState' in params because of Vue reactive<>
  watch(filterState, async() => {
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
  },{ deep: true });

  return {
    activeCategory,
    currentTags,
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