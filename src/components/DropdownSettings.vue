<script setup lang="ts">
import { useLocalSettingsStore } from '@/stores/localSettingsStore';

const localSettingsStore = useLocalSettingsStore();
</script>

<template>
  <div class="settings-dropdown-root">
    <div class="background">
      <span class="settings-title">Settings</span>
      
      <label class="checkbox-container">
        <input type="checkbox" v-model="localSettingsStore.preserveBG">
        <span class="checkmark"></span>
        <span style="user-select: none;">Preserve current background colour</span>
      </label>

      <label class="checkbox-container">
        <input type="checkbox" v-model="localSettingsStore.excludeNullPreview">
        <span class="checkmark"></span>
        <span style="user-select: none;">Exclude songs without preview audio</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.settings-dropdown-root {
  background-color: rgb(37, 37, 37);
  padding: 7px;
  border-radius: .95rem;
  color: white;
  width: max-content;
}

.background {
  background-color: rgba(0, 0, 0, 0.667);
  padding: 20px;
  border-radius: .9rem;
}

.settings-title {
  font-size: 1.4rem;
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
}

/* CHECKBOX STYLING */
.checkbox-container input[type="checkbox"] {
  display: none;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 4px;
}

.checkbox-container .checkmark {
  position: relative;
  height: 20px;
  width: 20px;
  border: 2px solid #ffffff;
  border-radius: 4px;
  margin-right: 10px;
  transition: background-color 0.3s, border-color 0.3s;
}

.checkbox-container .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid rgb(0, 0, 0);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.3s;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark {
  background-color: #ffffff;
  border-color: #ffffff;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
  opacity: 1;
}
</style>