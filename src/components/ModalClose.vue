<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: "Close"
  }
});

const emit = defineEmits(["click"]);
</script>

<template>
  <button class="close-button" @click="$emit('click')">
    {{ label }}
  </button>
</template>

<style scoped>
.close-button {
  background-color: #e1e1e1;
  color: #333;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.close-button:hover {
  background-color: #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.close-button:active {
  background-color: #d6d6d6;
  box-shadow: none;
}
</style>
