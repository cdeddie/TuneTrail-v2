<script setup lang="ts">
import { useRecommendationStore }             from '@/stores/recommendationStore';
import { pickBWTextColour, convertRgbToRgba } from '@/utils/colourStyle';
import { truncateString }                     from '@/utils/stringProcessing';

const recommendationStore = useRecommendationStore();
</script>

<template>
  <div class="add-tags-prompt" v-if="recommendationStore.currentTags.length === 0">
    <div class="prompt">
      <i class="bi bi-plus-circle" style="margin-right: 6px;"></i>
      <span>Add tags to find new songs</span>
    </div>
  </div>

  <div v-else class="tags-scroll-container">
    <div class="tag-parent">
      <div>
        <div
          v-for="(tag) in recommendationStore.currentTags"
          :key="tag.id"
          class="tag-container"
          :style="{ backgroundColor: convertRgbToRgba(tag.colour, 0.5) }"
        >
          <img v-if="tag.image !== ''" :src="tag.image" alt="Tag Image">
          <span v-if="tag.image !== ''" :style="{ color: pickBWTextColour(tag.colour) }">
            {{ truncateString(tag.name, 15) }}
          </span>
          <i v-else class="bi bi-person-fill img-alt"></i>
          <i
            class="fa fa-times-circle"
            aria-hidden="true"
            @click="recommendationStore.removeTrackTag(tag)"
            :style="{ color: pickBWTextColour(tag.colour) }"
          ></i>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.tags-scroll-container {
  width: 100vw;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.add-tags-prompt {
  height: calc(5vh + 10px);
  display: flex;
  justify-content: center;
}

.prompt {
  margin-top: auto;
  margin-bottom: auto;
  color: rgba(228, 228, 228, 0.689);
}

.tag-parent {
  display: inline-flex;
  flex-direction: row;
  margin-left: 4vw;
  margin-right: 4vw;
}

.tag-container {
  border: 1px solid white;
  min-width: fit-content;
  max-height: 5vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  margin-top: 10px;
  margin-right: 10px;

  animation: popout 1s ease;
  -webkit-animation: popout 1s ease;
}

@keyframes popout {
  from { transform: scale(0); }
  80% { transform: scale(1.1); }
  to { transform: scale(1); }
}

@-webkit-keyframes popout {
  from { -webkit-transform: scale(0); }
  80% { -webkit-transform: scale(1.1); }
  to { -webkit-transform: scale(1); }
}

.tag-container img {
  height: calc(5vh - 2px);
  border-radius: 0.5rem 0 0 0.5rem;
}

.tag-container span {
  padding: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.tag-container i {
  margin-right: 10px;
  font-size: 1.25rem;
}

.tag-container i:hover {
  cursor: pointer;
}
</style>
