<script setup lang="ts">
import { ref, watch, }         from 'vue';

const props = defineProps<{
  left: string,
  right: string,
}>();

const emit = defineEmits<{
  (event: 'update-active-value', activeValue: string): void
}>();

const activeValue = ref<string>(props.left);

const setActive = (value: string) => {
  activeValue.value = value;
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
    <div
      class="indicator"
      :style="{ transform: activeValue === left ? 'translateX(0%)' : 'translateX(100%)' }"
    ></div>
    <button
      @click="setActive(left)"
      :class="{ active: activeValue === left }"
    >
      {{ left }}
    </button>
    <button
      @click="setActive(right)"
      :class="{ active: activeValue === right }"
    >
      {{ right }}
    </button>
  </div>
</template>


<style scoped>
.toggle-container {
  position: relative;
  display: flex;
  border: 1.5px solid white;
  border-radius: 1rem;
  padding: 3px;
  width: fit-content;
  min-height: 5vh;
  overflow: hidden;
}

button {
  flex: 1;
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  color: white;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.indicator {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  width: calc(50% - 2px);
  background-color: rgb(33, 33, 33);
  border-radius: 0.8rem;
  transition: transform 0.3s ease;
  z-index: 0;
}
</style>
