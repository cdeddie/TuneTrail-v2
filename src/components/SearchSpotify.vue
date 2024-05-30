<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { Tag, createTag } from '../types/TagType';
import debounce from 'debounce';

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

const searchCategory = ref<string>('Artists');
const tags = ref<Tag[]>([]);

const showDropdown = ref<boolean>(false);
const inputFocused = ref<boolean>(false);
const query = ref<string>('');
const searchResults = ref<any>(null);
const isLoading = ref<boolean>(true);

const emit = defineEmits<{ 
  (event: 'update-tags', tags: Tag[]): void; 
  (event: 'search-focused', inputFocused: boolean): void;
}>();

const props = defineProps<{ pTags: Tag[] }>();

const changeCategory = (newCategory: string) => {
  searchCategory.value = newCategory;
}

watchEffect(() => {
  tags.value = props.pTags;
});

watch(tags, () => {
  emit('update-tags', tags.value);
}, { deep: true });

const fetchSearch = async() => {
  if (query.value.trim().length === 0) {
    return;
  }

  try {
    const sanitizedQuery = encodeURIComponent(query.value?.toLowerCase());
    // TODO: Handle user login (future). Also value needs to be between Songs and Artists
    const url = `${baseUrl}/public-search?query=${sanitizedQuery}&type=${searchCategory.value?.toLowerCase().slice(0, -1)}`;
    console.log(url);
    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: any = await response.json();
    searchResults.value = data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    isLoading.value = false;
  }
};

// We're looking into this very strongly
const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
    inputFocused.value = false;
  }, 100);
};

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

watch(() => tags.value.length, (newLength) => {
  if (newLength >= 5) {
    query.value = '';
  }
}, { immediate: true });

watch(query, debounce(fetchSearch, 500));

watch(searchCategory, () => {
  searchResults.value = null;
  query.value = '';
  tags.value = [];
});

watch(inputFocused, () => {
  emit('search-focused', inputFocused.value);
});
</script>

<template>
  <div class="input-container">
    <div class="search-bar">
      <input 
        class="input-bar" 
        v-model="query" 
        :placeholder="tags.length >= 5 ? 
                      `Maximum number of ${searchCategory?.toLowerCase()} reached` : 
                      `Add up to 5 ${searchCategory?.toLowerCase().slice(0, -1)}s...`"
        type="text" 
        @keyup.enter="fetchSearch" 
        @focus="showDropdown = true; inputFocused = true;" 
        @blur="handleBlur"
        :disabled="tags.length >= 5"
      >
      <div class="switch-container">
        <span 
          @click="changeCategory('Artists')" 
          :class="{ 'active-category': searchCategory === 'Artists' }"
        >Artists&nbsp;</span> | 
        <span 
          @click="changeCategory('Tracks')"
          :class="{ 'active-category': searchCategory === 'Tracks' }"
        >&nbsp;Tracks</span>
      </div>
    </div>
    <div class="divider"></div>

    <div class="search-results-dropdown" v-show="showDropdown">
      <div 
        v-if="searchResults && searchCategory === 'Artists'" 
        v-for="(artist) in searchResults.artists.items" 
        :key="artist.id"
        class="search-results" 
        @click="addTag(artist)"
      >
        <div v-if="!artist.images[2]?.url" class="alternate-image">
            <i class="fa fa-spotify"></i>
        </div>
        <img v-else :src="artist.images[2]?.url" class="search-image">
        <span>{{ artist.name }}</span>
      </div>

      <div 
        v-if="searchResults && searchCategory === 'Tracks'" 
        v-for="(track) in searchResults.tracks.items" 
        :key="track.id" 
        class="search-results" 
        @click="addTag(track)"
      >
        <div 
          v-if="!track.album.images[2]" 
          class="alternate-image">
          <i class="fa fa-spotify"></i>
        </div>
        <img v-else :src="track.album.images[2]?.url" class="search-image">
        <span>{{ track.name }} - 
          <span 
            v-for="(artist, index) in track.artists" :key="artist.id">{{ artist.name }}
            <span v-if="index < track.artists.length - 1">, </span>
          </span>
        </span>
      </div>  
    </div> 
    
    <!-- <div class="tags-group">
      <div v-for="(tag) in tags" :key="tag.id" class="tag-container">
        <img v-if="tag.image" :src="tag.image">
        <span>{{ tag.name }}</span>
        <i class="fa fa-times-circle remove-tag" aria-hidden="true" @click="removeTag(tag)"></i>
      </div>
    </div> -->
  </div>


</template>

<style scoped>
.input-container {
  position: absolute;
  color: white;
  margin-left: 28.75%;
  margin-right: 28.75%;
  z-index: 1000;
}

.input-bar {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Circular', Arial;
  background: none;
  outline: none;
  box-shadow: none;
  border: none;
  display: flex;
  font-size: 20px;
  width: 42.5vw;
  box-sizing: border-box;
  width: 100%;
}

.search-bar {
  display: flex;
  flex-direction: row;
}

.switch-container {
  font-family: 'Circular';
  display: flex;
  flex-direction: row;
  user-select: none;
  color: grey;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 1.1rem;
}

.switch-container span:hover {
  cursor: pointer;
}

.active-category {
  color: white;
}

.divider {
  width: 42.5vw;
  margin-top: 3px;
  border-top: 2px solid rgba(255, 255, 255, 0.8);
}

.tags-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 0;
}

.tag-container {
  background-color: rgba(147, 193, 126, 0.549);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

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
  width: 70px;
  height: 70px;
  border-radius: 10px 0 0 10px;
}

.tag-container span {
  padding: 20px;
  font-weight: 700;
}

.tag-container i {
  padding-right: 10px;
}

.tag-container i:hover {
  cursor: pointer;
}

.search-results-dropdown {
  background-color: rgba(69, 184, 69, 0.315);
  font-family: 'Circular', Arial;
  box-shadow: 0 8px 16px rgba(66, 66, 66, 0.2);
  z-index: 1000;
  position: absolute;
  width: 42.5vw;
}

.search-results {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 8px 2px 4px;
  font-size: 14px;
}

.search-results:hover {
  background-color: rgba(200, 200, 200, 0.2);
  cursor: pointer;
}

.search-image {
  width: 40px;
  height: 40px;
  margin-right: 4px;
  margin-top: 2px;
  margin-bottom: 2px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(147, 144, 144, 0.169);
}

.alternate-image i {
  width: 40px;
  height: 40px;
  font-size: 44px;
  margin-right: 4px;
  margin-bottom: 2px;
}

@media (max-width: 1100px) {
  .input-bar {
    font-size: 1rem;
  }

  .search-bar span {
    font-size: 1rem;
  }
  
  .search-results {
    font-size: .8rem;
  }
}

</style>