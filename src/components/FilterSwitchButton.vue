<script setup lang="ts">
import { computed }                     from 'vue';
import { storeToRefs }                  from 'pinia';
import type { RecommendationFilter }    from '@/types/RecommendationType';
import { useRecommendationFilterStore } from '@/stores/recommendationFilterStore';

const store = useRecommendationFilterStore();
const { filterState } = storeToRefs(store);

const props = defineProps<{
  label: keyof RecommendationFilter,
}>();

const activeValue = computed({
  get: () => {
    const value = filterState.value[props.label];
    if (value === 100) return 'High';
    if (value === 20) return 'Low';
    return null;
  },
  set: (newValue: 'High' | 'Low' | null) => {
    store.updateFilterValue(props.label, newValue);
  }
});

const setActive = (value: 'High' | 'Low') => {
  activeValue.value = activeValue.value === value ? null : value;
};
</script>

<template>
  <!-- <div style="color: white;">{{ label }}{{ activeValue }}</div> -->
  <div class="toggle-container">
    <button 
      @click="setActive('High')"
      :class="{ active: activeValue === 'High' }"
      style="margin-right: 2px;"
    >
      High
    </button>
    <span style="color: white; align-items: center;">|</span>
    <button 
      @click="setActive('Low')"
      :class="{ active: activeValue === 'Low' }"
      style="margin-left: 2px;"
    >
      Low
    </button>
  </div>
</template>

<style scoped>
.toggle-container {
  display: flex;
  border: 1.5px solid white;
  border-radius: .3rem;
  padding: 3px;
  width: fit-content;
  background-color: black;
}

button {
  padding: 2.5px 2.2vw;
  border: none;
  background-color: transparent;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

button.active::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background-color: rgba(170, 170, 170, 0.606);
  border-radius: .2rem;
  z-index: -1;
}

@media (max-width: 600px) {
  button {
    padding: 2.5px 17vw;
    height: 3.25vh;
  }
}
</style>