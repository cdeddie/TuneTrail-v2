<script setup lang="ts">
import { themes, useColourThemeStore } from '@/stores/colourThemeStore';

const themeStore = useColourThemeStore();
</script>

<template>
  <div class="settings-dropdown-root">
    <span class="settings-title">Settings</span>
    <span class="theme-title">Theme</span>
    <div class="theme-grid">
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="theme-circle"
        :class="{ active: theme.id === themeStore.activeThemeId }"
        @click="themeStore.setActiveTheme(theme.id)"
      >
        <div class="theme-half" :style="{ backgroundColor: theme.color1 }"></div>
        <div class="theme-half" :style="{ backgroundColor: theme.color2 }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-dropdown-root {
  background-color: rgba(0, 0, 0, 0.667);
  padding: 20px;
  border-radius: 1rem;
  color: white;
}

.settings-title {
  font-size: 1.4rem;
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
}

.theme-title {
  font-size: 1.1rem;
  display: block;
  margin-bottom: 15px;
  text-decoration: underline;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(4, 40px);
  grid-template-rows: repeat(2, 40px);
  gap: 15px;
  justify-content: center;
}

.theme-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  display: flex;
}

.theme-circle.active {
  transform: scale(1.2);
}

.theme-half {
  width: 50%;
  height: 100%;
}
</style>