import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBackgroundStore = defineStore('BackgroundStore', () => {
  const backgroundColour = ref<string>('black');

  const setBackgroundColour = (colour: string) => {
    backgroundColour.value = colour;
  };

  return {
    backgroundColour,
    setBackgroundColour
  }
});