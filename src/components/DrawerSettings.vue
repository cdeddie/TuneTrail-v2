<script setup lang="ts">
import { ref, onMounted }                 from 'vue';
import { RecommendationFilter }           from '@/types/RecommendationType';
import FilterSwitchButton                 from './FilterSwitchButton.vue';
import { useRecommendationFilterStore }   from '@/stores/recommendationFilterStore';
import { themes, useColourThemeStore }    from '@/stores/colourThemeStore';
import { useAuthStore }                   from '@/stores/authStore';

// Theme settings
const themeStore = useColourThemeStore();

// Filters
const store = useRecommendationFilterStore();
const filterState = store.filterState;

const capitalizeFirstLetter = (key: keyof RecommendationFilter): string => {
  const str = key as string;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const buttonElement = ref<HTMLElement[] | null>(null);
let buttonElementBounds: DOMRect;

onMounted(() => {
  if (buttonElement.value) {
    const el = buttonElement.value;
    buttonElementBounds = el[0].getBoundingClientRect();

    document.documentElement.style.setProperty('--button-element-left', `${buttonElementBounds.left}px`);
    document.documentElement.style.setProperty('--button-element-width', `${buttonElementBounds.width}px`);
    document.documentElement.style.setProperty('--button-element-top', `${buttonElementBounds.top}px`);
    document.documentElement.style.setProperty('--button-element-height', `${buttonElementBounds.height}px`);
  }
});

// Auth
const authStore = useAuthStore();

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

const redirectToLogin = () => {
  window.location.replace(`${baseUrl}/api/auth/login`);
};

const logoutAndRefresh = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      location.reload();
      authStore.setLoginStatus(false);
    } else {
      console.error('Logout failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
</script>

<template>
  <div class="filters">
    <div v-for="(_value, key) in filterState" :key="key" class="filter-item">
      <div class="filter-label">{{ capitalizeFirstLetter(key) }}</div>
      <div class="filter-switch-wrapper" ref="buttonElement">
        <FilterSwitchButton
          :label="key"
          class="filter-switch-button"
        />
      </div>
    </div>
  </div>

  <div class="settings-drawer">
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

  <hr style="margin: 5px calc(2 * var(--button-element-left)) 10px calc(2 * var(--button-element-left)); border: 1.5px solid var(--primary-colour);">

  <div class="auth-drawer">
    <div class="button-wrapper">
      <div v-if="!authStore.isLoggedIn" class="log" @click="redirectToLogin">
        <i class="bi bi-spotify"></i>
        <span> Login</span>
      </div>
      <div v-else class="log" @click="logoutAndRefresh">
        <i class="bi bi-box-arrow-left"></i>
        <span> Logout</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  border-radius: .95rem;
  padding: 7px 7px 0 7px;
}

.filter-item {
  margin-bottom: 1vh;
}

.filter-switch-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.filter-label {
  margin-top: 6px;
  font-weight: 700;
  margin-left: calc(2 * var(--button-element-left));
  color: var(--primary-colour);
}

.filter-switch-button {
  background-color: var(--primary-colour);
  transition: 1s background-color ease;
}

/* Colour settings */

.settings-drawer {
  padding: 7px;
  border-radius: .95rem;
  color: white;
}

.theme-title {
  font-size: 1.3rem;
  font-weight: 700;
  display: block;
  margin-bottom: 15px;
  color: var(--primary-colour);
  margin-left: calc(2 * var(--button-element-left));
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
  border: 1.5px solid rgba(105, 105, 105, 0.532);
}

.theme-half {
  width: 50%;
  height: 100%;
}

/* Auth */
.auth-drawer {
  background-color: var(--primary-colour);
  padding: 7px;
  border-radius: .95rem;
  color: white;
  width: 40vw;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 15px;
}

.button-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--secondary-colour);
  border-radius: .7rem;
  width: stretch;
  padding: 5px 15px;
  transition: transform 0.3s ease, filter 0.3s ease;
  color: var(--primary-colour);
}

.button-wrapper span {
  margin-left: 7px;
  display: inline-block;
  white-space: nowrap;
  font-weight: 700;
}

.button-wrapper:hover {
  cursor: pointer;
  filter: brightness(1.2);
  transform: translateY(-2.5px);
}

.log {
  display: flex;
  flex-direction: row;
}
</style>
