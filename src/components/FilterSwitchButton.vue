<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  left: string,
  right: string,
}>();

const emit = defineEmits<{
  (event: 'update-active-value', activeValue: string | null): void
}>();

const activeValue = ref<string | null>(null);

const setActive = (value: string) => {
  if (activeValue.value === value) {
    activeValue.value = null;
  } else {
    activeValue.value = value;
  }
  emit('update-active-value', activeValue.value);
};

// Watch for prop changes and update activeValue if needed
watch(() => props.left, (newValue) => {
  if (activeValue.value === props.right) return;
  activeValue.value = newValue;
  emit('update-active-value', newValue);
});

watch(() => props.right, (newValue) => {
  if (activeValue.value === props.left) return;
  activeValue.value = newValue;
  emit('update-active-value', newValue);
});
</script>

<template>
  <div class="toggle-container">
    <button 
      @click="setActive(left)"
      :class="{ active: activeValue === left }"
      style="margin-right: 2px;"
    >
      {{ left }}
    </button>
    <span style="color: white; align-items: center;">|</span>
    <button 
      @click="setActive(right)"
      :class="{ active: activeValue === right }"
      style="margin-left: 2px;"
    >
      {{ right }}
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
  padding: 2.5px 2vw;
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
</style>