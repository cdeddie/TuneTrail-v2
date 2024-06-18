<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Tag } from '../types/TagType';
import { Slider } from '@/components/ui/slider';
import { pickBWTextColour } from '@/utils/colourStyle';
import debounce from 'debounce';

export type SliderItem = {
  name: string;
  value: number[];
};

const toggleSidebar = ref<boolean>(false);
const sidebarRef = ref<HTMLElement | null>(null);

const sliders = ref<SliderItem[]>([
  { name: 'acousticness', value: [0] },
  { name: 'danceability', value: [0] },
  { name: 'energy', value: [0] },
  { name: 'instrumentalness', value: [0] },
  { name: 'liveness', value: [0] },
  { name: 'loudness', value: [0] },
  { name: 'popularity', value: [0] },
  { name: 'speechiness', value: [0] },
  { name: 'tempo', value: [0] },
  { name: 'valence', value: [0] },
]);

const emit = defineEmits<{ 
  (event: 'update-filters', filters: SliderItem[]): void 
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
// Emitting recommendations
watch(sliders.value, debounce(() => {
  emit('update-filters', sliders.value);
}, 500));

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

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;


  if (sidebarRef.value && !sidebarRef.value.contains(target) 
      && !target.closest('.input-bar') && !target.closest('.sidebar-toggle')) {
    toggleSidebar.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <div class="sidebar-container">
    <div class="sidebar" ref="sidebarRef" :class="{ 'open': toggleSidebar }">
      <div class="sidebar-content">
        <div class="title">Filters</div>
        <div>
          <div class="filter-title">{{ tagsTitle }}</div>
          <div class="tag-container">
            <div v-for="tag in modifiedTags" :key="tag.id" class="tag" :style="{ backgroundColor: tag.colour }">
              <img :src="tag.image" class="tag-image" />
              <div class="tag-details">
                <div class="tag-name-container">
                  <span class="tag-name" :style="{ color: pickBWTextColour(tag.colour) }">{{ tag.name }}</span>
                </div>
                <i 
                  class="fa fa-times-circle remove-tag" 
                  aria-hidden="true" 
                  @click="removeTag(tag)" 
                  :style="{ color: pickBWTextColour(tag.colour) }"
                ></i>
              </div>
            </div>
          </div>
        </div>

        <div class="filter-title text-right">Filters</div>
        <div class="filters-container">
          <div v-for="slider in sliders" class="slider-container">
            <span class="slider-title align-top" style="font-family: 'Circular';">{{ slider.name }}</span>
            <Slider v-model="slider.value" />
          </div>
        </div>

      </div>
    </div>

    <div class="sidebar-toggle" @click="toggleSidebar = !toggleSidebar" :class="{ 'open': toggleSidebar }">
      <i class="fa fa-caret-left" :class="{ 'open': toggleSidebar }" aria-hidden="true"></i>
    </div>
  </div>

  <div class="overlay" v-show="toggleSidebar"></div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 999;
}

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
  color: rgb(36,48,94);
  user-select: none;
  background-color: rgb(255,207,122);
  border-radius: 5px 0 0 5px;
  padding: 10px;
  cursor: pointer;
  z-index: 1002;
  transition: right 0.3s ease;
}

.sidebar-toggle.open {
  right: 22vw;
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
  right: -22vw;
  width: 22vw;
  height: 100vh;
  transition: right 0.3s ease;
  overflow: hidden;
  background-color: rgb(45,39,63);
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
  font-family: 'Circular';
  color: whitesmoke;
  padding: 1vh 5vw;
  font-size: 1.1rem;
  font-weight: 600;
}

.title {
  background-color: rgb(255,207,122);
  color: rgb(36,48,94);
  margin-top: 0;
  padding: 20px 5vw;
  font-size: 1.4rem;
  font-family: 'Circular';
  font-weight: 700;
}

.filters-container {
  padding: 0 5vw;
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

@media (max-width: 1200px) {
  .title {
    display: none;
  }

  .filter-title {
    padding: 1.5vh 3vw 0 3vw;
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

  .filters-container {
    padding: 0 3vw;
  }

  span.slider-title {
    font-size: .9rem;
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
  font-family: 'Circular';
  display: block;
}

/* Slider styles */
.slider-container {
  color: white;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
}

span.slider-title {
  margin-left: auto;
}
</style>