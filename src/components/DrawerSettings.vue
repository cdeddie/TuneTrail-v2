<script setup lang="ts">
import { ref, onMounted }                 from 'vue';
import { RecommendationFilter }           from '@/types/RecommendationType';
import FilterSwitchButton                 from './FilterSwitchButton.vue';
import { useRecommendationStore }         from '@/stores/recommendationStore';
import { useAuthStore }                   from '@/stores/authStore';
import { useLocalSettingsStore }          from '@/stores/localSettingsStore';

// Filters
const recommendationStore = useRecommendationStore();
const filterState = recommendationStore.filterState;

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
  const currentUrl = window.location.href;
  window.location.replace(`${baseUrl}/api/auth/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
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

// Settings
const localSettingsStore = useLocalSettingsStore();
</script>

<template>
  <div class="filters">
    <span class="settings-title" style="margin-left: calc(2 * var(--button-element-left));">Filters</span>
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
    <span class="settings-title">Settings</span>
    
    <label class="checkbox-container">
      <input type="checkbox" v-model="localSettingsStore.preserveBG">
      <span class="checkmark"></span>
      <span style="user-select: none;">Preserve current background colour</span>
    </label>

    <label class="checkbox-container">
      <input type="checkbox" v-model="localSettingsStore.excludeNullPreview">
      <span class="checkmark"></span>
      <span style="user-select: none;">Exclude songs without preview audio</span>
    </label>
  </div>

  <hr style="margin: 5px calc(2 * var(--button-element-left)) 10px calc(2 * var(--button-element-left)); border: 1.5px solid black">

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
  color: white;
}

.filter-switch-button {
  transition: 1s background-color ease;
}

/* Auth */
.auth-drawer {
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
  border-radius: .7rem;
  width: stretch;
  background-color: rgb(31, 215, 96);
  border: 3px solid black;
  padding: 7px 0;
}

.button-wrapper span {
  margin-left: 6px;
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

/* Settings */
.settings-drawer {
  padding: 7px;
  border-radius: .95rem;
  color: white;
  padding: 7px;
  margin-left: calc(2 * var(--button-element-left));
}

.settings-title {
  color: white;
  font-size: 1.4rem;
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
}

/* CHECKBOX STYLING */
.checkbox-container input[type="checkbox"] {
  display: none;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 4px;
}

.checkbox-container .checkmark {
  position: relative;
  height: 20px;
  width: 20px;
  border: 2px solid #ffffff;
  border-radius: 4px;
  margin-right: 10px;
  transition: background-color 0.3s, border-color 0.3s;
}

.checkbox-container .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid rgb(0, 0, 0);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.3s;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark {
  background-color: #ffffff;
  border-color: #ffffff;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
  opacity: 1;
}
</style>
