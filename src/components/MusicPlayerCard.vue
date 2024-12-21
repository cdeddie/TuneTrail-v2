<script setup lang="ts">
// Provides an image component with an option for a modal (image expands to focus)
import { ref } from 'vue';
import Modal from './CustomModal.vue';

const isModalOpen = ref<boolean>(false);
const isOverlayActive = ref<boolean>(false);

const props = defineProps<{
  currentTrack: SpotifyApi.RecommendationTrackObject | undefined;
  modalEnabled: boolean;
}>();

const enableModal = () => {
  if (props.modalEnabled === true) {
    isModalOpen.value = true;
  }
};
</script>

<template>
  <div 
    class="image-parent" 
    @click="enableModal" 
    @mouseover="isOverlayActive = true"
    @mouseleave="isOverlayActive = false"
    :style="{ pointerEvents: modalEnabled ? 'auto' : 'none' }"
  >
    <div class="image-card" @click="isModalOpen = true">
      <div class="modal-prompt-overlay" v-if="modalEnabled && isOverlayActive">
        <i class="bi bi-eye"></i>
      </div>
      <img class="album-cover" :src="currentTrack?.album.images[0].url">
    </div>

    <Modal v-if="modalEnabled" :modalValue="isModalOpen" @update:modalValue="isModalOpen = $event">
      <img class="expanded-album-cover" :src="currentTrack?.album.images[0].url">
    </Modal>
  </div>
</template>


<style scoped>
.image-parent {
  position: relative;
}

.image-card {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
}

.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-prompt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 2rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.image-card:hover .modal-prompt-overlay {
  opacity: 1;
  filter: brightness(0.8);
}

.expanded-album-cover {
  height: 70vh;
}
</style>