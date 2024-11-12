import { defineStore } from 'pinia';
import { ref, watch, onMounted } from 'vue';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorageUtils';

export const useLocalSettingsStore = defineStore('localSettings', () => {
  const excludeNullPreview = ref<boolean>(false);     // Excludes tracks without preview URLs from recommendation results
  const preserveBG = ref<boolean>(false);             // Preserves the background color setting (stops updating bg)
  const backgroundColour = ref<string>('black');      // Background color

  // Load settings from localStorage on store initialization
  onMounted(() => {
    const savedSettings = loadFromLocalStorage<{ 
      excludeNullPreview: boolean; 
      preserveBG: boolean; 
      backgroundColour: string 
    }>('localSettings');

    if (savedSettings) {
      if (typeof savedSettings.excludeNullPreview === 'boolean') {
        excludeNullPreview.value = savedSettings.excludeNullPreview;
      }
      if (typeof savedSettings.preserveBG === 'boolean') {
        preserveBG.value = savedSettings.preserveBG;
      }
      if (typeof savedSettings.backgroundColour === 'string') {
        backgroundColour.value = savedSettings.backgroundColour;
      }
    }

    if (preserveBG) {
      document.documentElement.style.setProperty('--bg', backgroundColour.value);
    }
  });

  watch([excludeNullPreview, preserveBG, backgroundColour], ([newExcludeNullPreview, newPreserveBG, newBackgroundColour]) => {
    saveToLocalStorage('localSettings', {
      excludeNullPreview: newExcludeNullPreview,
      preserveBG: newPreserveBG,
      backgroundColour: newBackgroundColour,
    });
  });

  const setBackgroundColour = (colour: string) => {
    backgroundColour.value = colour;
  };

  return { excludeNullPreview, preserveBG, backgroundColour, setBackgroundColour };
});
