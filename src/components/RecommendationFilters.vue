<script setup lang="ts">
import { ref, watchEffect } from 'vue';

interface SliderItem {
  name: string;
  value: number;
}

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

const emit = defineEmits<{ (event: 'update-filters', filters: Record<string, number>): void }>();

// We're looking into this very strongly
// Returns 
watchEffect(() => {
  const values = sliders.value.reduce((obj, slider) => {
    obj[slider.name] = slider.value;
    return obj;
  }, {} as Record<string, number>);

  emit('update-filters', values);
});

</script>

<template>
  <div class="sidebar-toggle">Filters</div>
  <div class="sidebar" :class="{ 'open': toggleSidebar }">
    <div class="sidebar-header">

    </div>
  </div>

</template>

<style scoped>
.sidebar-toggle {
  font-family: 'Circular';
  font-size: 1.2rem;
  writing-mode: vertical-rl;
  color: white;
  overflow: hidden;
  user-select: none;
  background-color: grey;
  border-radius: 5px 0 0 5px;
  padding: 10px;
}

.sidebar-toggle:hover {
  cursor: pointer;
}

</style>