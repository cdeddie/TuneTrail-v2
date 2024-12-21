<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
  modalValue: Boolean
});

const emit = defineEmits(['update:modalValue']);

const closeModal = () => {
  emit('update:modalValue', false);
};

const handleEscKey = (event: KeyboardEvent) => {
  if (props.modalValue && event.key === 'Escape') {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey);
});
</script>

<template>
  <Teleport to="#modal">
    <Transition name="modal">
      <div v-if="props.modalValue" class="modal-mask" @click="closeModal">
        <div class="modal-container" @click.stop>
          <slot></slot> <!-- Modal content -->
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.modal-container {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.05);
  transform: scale(1.05);
}
</style>