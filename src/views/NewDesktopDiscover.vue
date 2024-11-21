<script setup lang="ts">
import DesktopDiscoverFlow from '@/components/DiscoverFlow.vue';
import DiscoverHeaderBar from '@/components/DiscoverHeaderBar.vue';
import TagArray from '@/components/TagArray.vue';
</script>

<template>
  <div class="discover-root">
    <DiscoverHeaderBar />
    <TagArray />
    <DesktopDiscoverFlow />
  </div>
</template>

<style scoped>
.discover-root {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>