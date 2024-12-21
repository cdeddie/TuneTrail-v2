import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorageUtils';

export const useLocalSettingsStore = defineStore('LocalSettings', () => {
  const excludeNullPreview = ref<boolean>(false);     // Excludes tracks without preview URLs from recommendation results
  const preserveBG = ref<boolean>(false);             // Preserves the background color setting (stops updating bg)
  const backgroundColour = ref<string>('black');      // Background color
  const audioVolume = ref<number>(50);                // Audio volume
  const usedLikeFeature = ref<boolean>(false);        // Whether the user has used the 'Add to Spotify liked' feature recently (TTL: 7 days)

  // Load settings from localStorage on store initialization
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

  // Load 'usedLikeFeature' with TTL handling (7 days)
  const savedUsedLikeFeature = loadFromLocalStorage<boolean>('usedLikeFeature');
  if (savedUsedLikeFeature !== null) {
    usedLikeFeature.value = savedUsedLikeFeature;
  }

  if (preserveBG.value) {
    document.documentElement.style.setProperty('--bg', backgroundColour.value);
  }

  watch([excludeNullPreview, preserveBG, backgroundColour, audioVolume], ([newExcludeNullPreview, newPreserveBG, newBackgroundColour, newAudioVolume]) => {
    saveToLocalStorage('localSettings', {
      excludeNullPreview: newExcludeNullPreview,
      preserveBG: newPreserveBG,
      backgroundColour: newBackgroundColour,
      audioVolume: newAudioVolume,
    });
  });

  // Watch for changes to `usedLikeFeature` and save with a 7-day TTL
  watch(usedLikeFeature, (newUsedLikeFeature) => {
    saveToLocalStorage('usedLikeFeature', newUsedLikeFeature, 7 * 24 * 60 * 60 * 1000);
  });

  const setBackgroundColour = (colour: string) => {
    backgroundColour.value = colour;
  };

  const markUsedLikeFeature = () => {
    usedLikeFeature.value = true;
  };

  return { 
    excludeNullPreview, 
    preserveBG, 
    backgroundColour, 
    audioVolume, 
    usedLikeFeature,
    setBackgroundColour,
    markUsedLikeFeature 
  };
});
