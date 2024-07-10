<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { fetchSearch } from '../utils/fetchSpotifySearch';
import debounce from 'debounce';
import { useColourThemeStore } from '@/stores/colourThemeStore';

// Search flow with other components
const props = defineProps<{
  placeholder: string,
  backgroundColour?: string,
  searchCategory: string,
  searchDisabled: boolean,
}>();

const emit = defineEmits<{
  (event: 'search-results', searchResults: any): void
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
const searchResults = ref<any>();

const debouncedFetchSearch = debounce(async (query: string, category: string) => {
  try {
    searchLoading.value = true;
    const result = await fetchSearch(query, category);
    searchResults.value = result;
  } catch (error) {
    console.error(error);
  } finally {
    searchLoading.value = false;
  }
}, 500);

watch(
  () => [searchQuery.value, props.searchCategory],
  ([newQuery, newCategory], [oldQuery, oldCategory]) => {
    if (newQuery !== oldQuery || newCategory !== oldCategory) {
      debouncedFetchSearch(newQuery, newCategory.toLowerCase());
    }
  }
);

watch(searchResults, async (newResults, oldResults) => {
  if (newResults != oldResults) {
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
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateElementPosition);
});

// Colour theme setting
const themeStore = useColourThemeStore();

const backgroundColor = computed(() => {
  return props.backgroundColour ?? themeStore.getPrimaryColour();
});

document.documentElement.style.setProperty('--search-background-colour', backgroundColor.value);

watch(() => themeStore.activeThemeId, () => {
  if (!props.backgroundColour) {
    document.documentElement.style.setProperty('--search-background-colour', themeStore.getPrimaryColour());
  }
});
</script>

<template>
  <div class="input-group">
    <input 
      type="text" 
      ref="searchElement"
      required
      v-model="searchQuery"
      @focus="emit('search-focused', true);"
      @blur="handleBlur"
      :disabled="searchDisabled"
    >
    <label for="" :class="{ 'disabled-input': searchDisabled }">
      <i class="bi bi-search"></i>
      <span>{{ props.placeholder }}</span>
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
  z-index: 1111;
  min-height: 5vh;
  position: relative;
  margin-left: 40px;
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

@media(max-width: 1050px) {
  .input-group input+label {
    font-size: 1rem;
  }

  .input-group input:focus,
  .input-group input:valid {
    padding-left: 1rem;
    font-size: 1.1rem;
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