<script setup lang="ts">
import { useRecommendationStore }               from '@/stores/recommendationStore';
import { Tag }                                  from '@/types/TagType';
import { pickBWTextColour, convertRgbToRgba }   from '@/utils/colourStyle';

const recommendationStore = useRecommendationStore();

const removeTag = (tag: Tag) => {
  if (recommendationStore.activeCategory === 'Tracks') recommendationStore.removeTrackTag(tag);
  else recommendationStore.removeArtistTag(tag);
};
</script>

<template>
  <div class="tag-parent">
    <div class="add-tags-prompt" v-if="recommendationStore.currentTags.length === 0">
      <div class="prompt">
        <i class="bi bi-plus-circle" style="margin-right: 6px;"></i>
        <span>Add tags to find new songs</span>
      </div>
    </div>

    <div v-else>
      <div
        v-for="(tag) in recommendationStore.currentTags"
        :key="tag.id"
        class="tag-container"
        :style="{ backgroundColor: convertRgbToRgba(tag.colour, 0.5) }"
      >
        <img v-if="tag.image" :src="tag.image">
        <i v-else class="bi bi-person-fill img-alt"></i>
        <span :style="{ color: pickBWTextColour(tag.colour) }">{{ tag.name }}</span>
        <i
          class="fa fa-times-circle"
          aria-hidden="true"
          @click="removeTag(tag)"
          :style="{ color: pickBWTextColour(tag.colour) }"
        ></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag-parent {
  display: flex;
  flex-direction: row;
  margin-left: calc(var(--search-element-left));
  margin-right: 25vw;
  flex-wrap: wrap;
}

.add-tags-prompt {
  height: calc(5vh + 10px);
  margin-left: auto;
  margin-right: auto;
}

.prompt {
  margin-top: 2.5vh;
  color: rgba(228, 228, 228, 0.689);
}

.tag-container {
  border: 1px solid white;
  margin-top: 10px;
  max-height: 5vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: .5rem;
  margin-right: 12px;

  animation: popout 1s ease;
  -webkit-animation: popout 1s ease;
}

@keyframes popout {
  from{transform:scale(0)}
  80%{transform:scale(1.1)}
  to{transform:scale(1)}
}

@-webkit-keyframes popout {
  from{-webkit-transform:scale(0)}
  80%{-webkit-transform:scale(1.1)}
  to{-webkit-transform:scale(1)}
}

.tag-container img {
  height: calc(5vh - 2px);
  border-radius: .5rem 0 0 .5rem;
}

.tag-container span {
  padding: 20px;
  font-size: .9rem;
  font-weight: 600;
}

.tag-container i {
  margin-right: 10px;
}

.tag-container i:hover {
  cursor: pointer;
}
</style>