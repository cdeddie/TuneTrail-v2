<script setup lang="ts">
import { ref, watchEffect, computed, watch } from 'vue';
import { Tag } from '../types/TagType';

type SliderItem = {
  name: string;
  value: number;
};

const toggleSidebar = ref<boolean>(false);

const sliders = ref<SliderItem[]>([
  { name: 'acousticness', value: 0 },
  { name: 'danceability', value: 0 },
  { name: 'energy', value: 0 },
  { name: 'instrumentalness', value: 0 },
  { name: 'liveness', value: 0 },
  { name: 'loudness', value: 0 },
  { name: 'popularity', value: 0 },
  { name: 'speechiness', value: 0 },
  { name: 'tempo', value: 0 },
  { name: 'valence', value: 0 },
]);

const emit = defineEmits<{ 
  (event: 'update-filters', filters: Record<string, number>): void 
  (event: 'update-tags', tags: Tag[]): void
}>();

const props = defineProps<{ pTags: Tag[], pSearchFocused: boolean }>();

const modifiedTags = computed({
  get: () => props.pTags,
  set: (newTags: Tag[]) => emit('update-tags', newTags)
});

const removeTag = (tag: Tag) => {
  modifiedTags.value = modifiedTags.value.filter((t) => t.id !== tag.id);
};

const tagsTitle = computed(() => {
  if (modifiedTags.value.length === 0) return 'Tags';
  return modifiedTags.value[0].type === 'Artist' ? 'Artists' : 'Tracks';
});

// We're looking into this very strongly
// Returns 
watchEffect(() => {
  const values = sliders.value.reduce((obj, slider) => {
    obj[slider.name] = slider.value;
    return obj;
  }, {} as Record<string, number>);

  emit('update-filters', values);
});

watch(modifiedTags, () => {
  const items = document.querySelectorAll('.tag');

  items.forEach(item => {
    if (item instanceof HTMLElement) {
      const randomValue = Math.floor(Math.random() * 90);
      const randomSide = Math.random() < 0.5 ? 'start' : 'end';
      item.style.justifySelf = `${randomSide} ${randomValue}%`;
    }
  });
});

watch(() => props.pSearchFocused, () => {
  if (props.pSearchFocused === true) {
    toggleSidebar.value = true;
  }
});
</script>

<template>
  <div class="sidebar-container">
    <div class="sidebar" :class="{ 'open': toggleSidebar }">
      <div class="sidebar-content">
        <div class="title-container">
          <h2>Filters</h2>
        </div>
        <div>
          <h3 class="filter-title">{{ tagsTitle }}</h3>
          <div class="tag-container">
            <div v-for="tag in modifiedTags" :key="tag.id" class="tag" :style="{ backgroundColor: tag.colour }">
              <img :src="tag.image" class="tag-image" />
              <div class="tag-details">
                <div class="tag-name-container">
                  <span class="tag-name">{{ tag.name }}</span>
                </div>
                <i class="fa fa-times-circle remove-tag" aria-hidden="true" @click="removeTag(tag)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidebar-toggle" @click="toggleSidebar = !toggleSidebar" :class="{ 'open': toggleSidebar }">
      <i class="fa fa-caret-left" :class="{ 'open': toggleSidebar }" aria-hidden="true"></i>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 1001;
}

.sidebar-toggle {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  font-family: 'Circular';
  color: white;
  user-select: none;
  background-color: rgb(35, 35, 35);
  border-radius: 5px 0 0 5px;
  padding: 10px;
  cursor: pointer;
  z-index: 1002;
  transition: right 0.3s ease;
}

.sidebar-toggle.open {
  right: 25vw;
}

.sidebar-toggle i {
  transition: transform 0.5s ease;
}

.sidebar-toggle i.open {
  transform: rotate(180deg);
}

.sidebar {
  position: fixed;
  top: 0;
  right: -25vw;
  width: 25vw;
  height: 100vh;
  transition: right 0.3s ease;
  overflow: hidden;
  background-color: rgb(0, 0, 0);
  opacity: 0.8;
}

.sidebar.open {
  right: 0;
}

.sidebar-content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.filter-title {
  color: whitesmoke;
  padding: 0 5.5vw;
  text-decoration: underline;
}

.title-container {
  background-color: rgba(44, 44, 44, 0.586);
}

h2 {
  color: whitesmoke;
  margin-top: 0;
  padding: 20px 5vw;
}

/* ---------- Tag styling ---------- */
.tag-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  padding: 0 5vw;
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

.tag {
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 25px;
  overflow: hidden;
  animation: popout 1s ease;
  -webkit-animation: popout 1s ease;
}

.tag-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 5px;
}

@media (max-width: 1100px) {
  .filter-title {
    padding: 0 3vw;
    font-size: 1rem;
  }

  .tag-container {
    padding: 0 3vw;
  }

  .tag-image {
    width: 25px;
    height: 25px;
  }

  span.tag-name {
    font-size: .75rem;
  }

  h2 {
    display: none;
    font-size: 1.2rem;
    padding: 10px 3vw;
    margin: 0;
  }
}

.tag-details {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  
}

.remove-tag {
  color: white;
  margin-left: auto;
  margin-right: 5%;
  padding-left: 5%;
  mix-blend-mode: difference;
}

.remove-tag:hover {
  cursor: pointer;
}

.tag-type {
  font-size: 12px;
  font-weight: bold;
}

.tag-name-container {
  overflow: hidden;
}

.tag-name {
  font-size: 14px;
  white-space: nowrap;
  mix-blend-mode: difference;
  color: white;
  font-family: 'Circular';
  display: block;
}

</style>