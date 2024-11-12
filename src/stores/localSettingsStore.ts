import { defineStore } from 'pinia';
import { ref, watch, onMounted } from 'vue';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorageUtils';

export const useLocalSettingsStore = defineStore('localSettings', () => {
  const excludeNullPreview = ref<boolean>(false);     // Excludes tracks without preview URLs from recommendation results
  const preserveBG = ref<boolean>(false);             // Preserves the background color setting (stops updating bg)
  const backgroundColour = ref<string>('black');      // Background color
  const audioVolume = ref<number>(50);                // Audio volume

  // Load settings from localStorage on store initialization
  onMounted(() => {
    const savedSettings = loadFromLocalStorage<{ 
      excludeNullPreview: boolean; 
      preserveBG: boolean; 
      backgroundColour: string;
      audioVolume: number;
    }>('localSettings');

    if (savedSettings) {
      excludeNullPreview.value = savedSettings.excludeNullPreview;
      preserveBG.value = savedSettings.preserveBG;
      backgroundColour.value = savedSettings.backgroundColour;
      audioVolume.value = savedSettings.audioVolume;
    }

    if (preserveBG) {
      document.documentElement.style.setProperty('--bg', backgroundColour.value);
    }
  });

  watch([excludeNullPreview, preserveBG, backgroundColour, audioVolume], ([newExcludeNullPreview, newPreserveBG, newBackgroundColour, newAudioVolume]) => {
    saveToLocalStorage('localSettings', {
      excludeNullPreview: newExcludeNullPreview,
      preserveBG: newPreserveBG,
      backgroundColour: newBackgroundColour,
      audioVolume: newAudioVolume,
    });
  });

  const setBackgroundColour = (colour: string) => {
    backgroundColour.value = colour;
  };

  return { excludeNullPreview, preserveBG, backgroundColour, audioVolume, setBackgroundColour };
});
