<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchSearch } from '../utils/fetchSpotifySearch';
import debounce from 'debounce';

const props = defineProps<{
  placeholder: string,
  backgroundColour: string,
  searchCategory: string,
}>();

const emit = defineEmits<{
  (event: 'search-results', searchResults: any): void
  (event: 'search-results-loading', searchResultsLoading: boolean): void
  (event: 'search-focused', searchFocused: boolean): void
}>();

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
</script>

<template>
  <div class="input-group">
    <input 
      type="text" 
      required
      v-model="searchQuery"
      @focus="emit('search-focused', true);"
      @blur="emit('search-focused', false);"
    >
    <label for="">
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
  height: 7vh;
  position: relative;
  margin: 0 40px;
  display: flex;
  flex-direction: row;
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
  --search-background-colour: v-bind($props.backgroundColour);
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