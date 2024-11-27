<script setup lang="ts">
import { computed } from 'vue';
import { RecommendationFilter }         from '@/types/RecommendationType';
import FilterSwitchButton               from './FilterSwitchButton.vue';
import { useRecommendationStore }       from '@/stores/recommendationStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// Contains filter state info for recommendations

const store = useRecommendationStore();
const filterState = store.filterState;

const capitalizeFirstLetter = (key: keyof RecommendationFilter): string => {
  const str = key as string;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:model-value']);

const dialogOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    // 0ms timeout delays emit to NEXT EVENT LOOP CYCLE.
    setTimeout(() => {
      emit('update:model-value', value);
    }, 0);
  },
});

</script>

<template>
  <div class="filter-dropdown-root">
    <div class="background">
      <span style="font-size: 1.4rem;">Filters</span>
      <div v-for="(_value, key) in filterState" :key="key" class="filter-item">
        <div style="color: white; margin-top: 6px; display: flex; flex-direction: row;">{{ capitalizeFirstLetter(key) }}
          <div v-if="key === 'popularity'">
            <Dialog v-model:open="dialogOpen">
              <DialogTrigger>
                <i class="bi bi-info-circle"></i>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle style="margin-bottom: 6px; font-size: 1.4rem;">How does Spotify popularity work?</DialogTitle>
                  <DialogDescription style="color: #555;">
                    <div>
                      <b>Why am I getting popular songs when setting popularity to "low"?</b>
                      Spotify provides a filter called 'target_popularity' for recommendations, with values ranging from 0 to 100. 
                      This website uses a value of 0 for the "low" filter and 100 for the "high" filter. 
                      <br><br>
                      However, while you might expect only obscure songs with a low popularity setting, some recommendations may still appear relatively popular. 
                      This is because Spotify's algorithm does not guarantee exact matches but trends towards the specified target. 
                      <br><br>
                      On average, when the filter is set to "low," the recommended songs have a popularity score of around 30, while with the "high" filter, the average is closer to 70.
                    </div>
                    <br>
                    <div>
                      <b>How does Spotify measure popularity?</b><br>
                      A track's popularity is a value between 0 and 100, with 100 being the most popular. This value is determined by an algorithm that primarily considers the total number of plays and the recency of those plays.
                      <br><br>
                      Generally, tracks with high recent play counts will have higher popularity scores compared to older tracks that were played more in the past. Duplicate tracks (e.g., the same track appearing on a single and an album) are rated independently. 
                      Note that popularity values may lag behind actual trends by a few days.
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <FilterSwitchButton
          :label="key"
          class="filter-switch-button"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-dropdown-root {
  background-color: rgb(37, 37, 37);
  border-radius: .95rem;
  padding: 7px;
}

.background {
  background-color: rgba(0, 0, 0, 0.667);
  padding: 20px;
  border-radius: .9rem;
}

.filter-dropdown-root span {
  color: white;
  font-size: 15px;
  font-weight: 700;
}

.filter-switch-button {
  margin-bottom: 1vh;
}

.bi-info-circle {
  margin-left: 5px;
  cursor: pointer;
  transition: color .3s ease;
}

.bi-info-circle:hover {
  color: rgb(203, 203, 203);
}
</style>