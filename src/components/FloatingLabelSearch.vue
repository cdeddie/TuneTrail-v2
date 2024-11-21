<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount }           from 'vue';
import { fetchSearch }                                      from '../utils/fetchSpotifySearch';
import { useLocalSettingsStore }                            from '@/stores/localSettingsStore';
import debounce                                             from 'debounce';
import { useAuthStore }                                     from '@/stores/authStore';

const authStore = useAuthStore();

// Search flow with other components
const props = defineProps<{
  placeholder?: string,
  backgroundColour?: string,
  searchCategory: string,
  searchDisabled: boolean,
}>();

const emit = defineEmits<{
  (event: 'search-results', searchResults: SpotifyApi.ArtistSearchResponse | SpotifyApi.TrackSearchResponse): void
  (event: 'search-results-loading', searchResultsLoading: boolean): void
  (event: 'search-focused', searchFocused: boolean): void
}>();

const handleBlur = () => {
  setTimeout(() => {
    emit('search-focused', false)
  }, 100)
}

const clearSearchQuery = () => searchQuery.value = '';

defineExpose({
  clearSearchQuery
});

// Spotify Searching
const searchLoading = ref<boolean>(false);
const searchQuery = ref<string>('');
const searchResults = ref<SpotifyApi.ArtistSearchResponse | SpotifyApi.TrackSearchResponse>();

const debouncedFetchSearch = debounce(async (query: string, category: string) => {
  try {
    searchLoading.value = true;
    const result = await fetchSearch(query, category, authStore.isLoggedIn);
    searchResults.value = result;
  } catch (error) {
    console.error(error);
  } finally {
    searchLoading.value = false;
  }
}, 500);

// Change this to only query value
watch(() => searchQuery.value, (newQuery, oldQuery) => {
  if (newQuery !== oldQuery) {
    debouncedFetchSearch(newQuery, props.searchCategory.toLowerCase());
  }
});

watch(() => props.searchCategory, () => {
  clearSearchQuery();
});

watch(searchResults, async (newResults, oldResults) => {
  if (newResults != oldResults && searchResults.value !== undefined) {
    emit('search-results', searchResults.value);
  }
});

watch(searchLoading, async () => {
  emit('search-results-loading', searchLoading.value);
});

watch(() => props.searchDisabled, () => {
  clearSearchQuery();
});

// Element positioning css vars
const searchElement = ref<HTMLElement | null>(null);
const searchElementPos = ref<DOMRect | undefined>();

const updateElementPosition = () => {
  if (searchElement.value) {
    const el = searchElement.value;
    searchElementPos.value = el.getBoundingClientRect();

    document.documentElement.style.setProperty('--search-element-left', `${searchElementPos.value.left}px`);
    document.documentElement.style.setProperty('--search-element-width', `${searchElementPos.value.width}px`);
    document.documentElement.style.setProperty('--search-element-top', `${searchElementPos.value.top}px`);
    document.documentElement.style.setProperty('--search-element-height', `${searchElementPos.value.height}px`);
  }
};

onMounted(() => {
  updateElementPosition();
  window.addEventListener('resize', updateElementPosition);
  // Colour for floating label 
  if (props.backgroundColour) document.documentElement.style.setProperty('--search-background-colour', props.backgroundColour);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateElementPosition);
});

// Colour for floating label
const localSettingsStore = useLocalSettingsStore();
watch(() => localSettingsStore.backgroundColour, (newBackground) => {
  if (!props.backgroundColour) {
    document.documentElement.style.setProperty('--search-background-colour', newBackground);
  }
});

onMounted(() => {
  // Colour for floating label 
  if (props.backgroundColour) {
    document.documentElement.style.setProperty('--search-background-colour', props.backgroundColour);
  } else {
    const computedStyle = getComputedStyle(document.documentElement);
    const currBackground = computedStyle.getPropertyValue('--bg') || localSettingsStore.backgroundColour;
    document.documentElement.style.setProperty('--search-background-colour', currBackground);
  }
});
</script>

<template>
  <div class="input-group">
    <form novalidate id="novalidate"></form>
    <input 
      form="novalidate"
      type="text" 
      ref="searchElement"
      required
      v-model="searchQuery"
      @focus="emit('search-focused', true);"
      @blur="handleBlur"
      :disabled="searchDisabled"
      @keydown.enter.prevent
    >
    <label for="" :class="{ 'disabled-input': searchDisabled }">
      <i class="bi bi-search"></i>
      <div v-if="placeholder">{{ placeholder }}</div>
      <div v-else>
        <span>Search and</span>
        <i class="bi bi-cursor" style="margin: 0 5px; transform: scaleX(-1);"></i>
        <span>a song to discover more!</span>
      </div>
    </label>
  </div>
</template>

<style scoped>
.bi-search {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  color: white;
}

.input-group {
  z-index: 5;
  min-height: 5vh;
  position: relative;
  margin-left: 4vw;
  margin-right: 20px;
  display: flex;
  flex-direction: row;
}

.input-group .disabled-input {
  color: grey;
}

.disabled-input i {
  color: grey;
}

.input-group label {
  position: absolute;
  top: 50%;
  left: .6rem;
  transform: translateY(-50%);
  font-size: 1.3rem;
  color: white;
  padding: 0 5px;
  pointer-events: none;
  transition: .3s;
  display: flex;
  flex-direction: row;
}

.input-group input {
  width: stretch;
  font-size: 1.3rem;
  color: #fff;
  padding: 0 30px;
  background: transparent;
  border: 1.2px solid white;
  outline: none;
  border-radius: 1rem;
}

.input-group input:focus ~ label,
.input-group input:valid ~ label {
  top: 0;
  font-size: .8rem;
  background-color: var(--search-background-colour);
  
}

.input-group input:focus ~ label i,
.input-group input:valid ~ label i {
  margin-right: 0.35rem;
}

.input-group input:focus,
.input-group input:valid {
  padding-left: 1rem;
  font-size: 1.4rem;
}

/* Responsiveness */
@media(max-width: 1450px) {
  .input-group input+label {
    font-size: 1.2rem;
  }

  .input-group input:focus,
  .input-group input:valid {
    padding-left: 1rem;
    font-size: 1.2rem;
  }
}

@media(max-width: 1050px) {
  .input-group input+label {
    font-size: 1.6rem;
  }

  .input-group input:focus,
  .input-group input:valid {
    padding-left: 1rem;
    font-size: 1.6rem;
  }
}

@media(max-width: 480px) {
  .input-group input+label {
    font-size: 1.05rem;
  }

  .input-group input:focus,
  .input-group input:valid {
    padding-left: 1rem;
    font-size: 16px;
  }
}

@media(min-width: 2000px) {
  .input-group input+label {
    font-size: 1.4rem;
  }

  .input-group input:focus,
  .input-group input:valid {
    padding-left: 1rem;
    font-size: 1.8rem;
  }

  .input-group input:focus ~ label,
  .input-group input:valid ~ label {
    font-size: 1rem;
  }
}
</style>