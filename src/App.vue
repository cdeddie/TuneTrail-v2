<script setup lang="ts">
import { onMounted }            from 'vue';
import { useColourThemeStore }  from './stores/colourThemeStore';

const themeStore = useColourThemeStore();

onMounted(() => {
  themeStore.setActiveTheme(themeStore.activeThemeId);
});
</script>

<template>
  <main class="app-root">
    <RouterView />
  </main>
</template>

<style scoped>
.app-root {
  height: 100vh;
}
</style>
