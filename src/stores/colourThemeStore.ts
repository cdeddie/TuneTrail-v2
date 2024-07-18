import { defineStore }  from 'pinia';
import { ref }          from 'vue';

export type Theme = {
  id:     number;
  color1: string;
  color2: string;
};

export const themes: Theme[] = [
  { id: 1, color1: '#2D283E', color2: '#4A71FD' },
  { id: 2, color1: '#FFC9B5', color2: '#F7B1AB' },
  { id: 3, color1: '#2D2D2A', color2: '#4C4C47' },
  { id: 4, color1: '#80A1C1', color2: '#EEE3AB' },
  { id: 5, color1: '#7353BA', color2: '#FAA6FF' },
  { id: 6, color1: '#D33F49', color2: '#D7C0D0' },
  { id: 7, color1: '#251605', color2: '#C57B57' },
  { id: 8, color1: '#111111', color2: '#1ED760' },
];

export const useColourThemeStore = defineStore('ColourThemeStore', () => {
  const activeThemeId = ref(parseInt(localStorage.getItem('colour-theme') ?? '1', 10));

  const setActiveTheme = (id: number) => {
    activeThemeId.value = id;
    localStorage.setItem('colour-theme', id.toString());
    document.documentElement.style.setProperty('--primary-colour', themes[id-1].color1);
    document.documentElement.style.setProperty('--secondary-colour', themes[id-1].color2);
  };

  const getPrimaryColour = (): string => {
    return themes[activeThemeId.value-1].color1;
  };

  const getSecondaryColour = (): string => {
    return themes[activeThemeId.value-1].color2;
  };

  return {
    activeThemeId,
    setActiveTheme,
    getPrimaryColour,
    getSecondaryColour
  }
});