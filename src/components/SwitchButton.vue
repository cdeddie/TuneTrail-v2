<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  left: string,
  right: string,
}>();

const emit = defineEmits<{
  (event: 'update-active-value', activeValue: string): void
}>();

const isChecked = ref(false);
const activeValue = ref<string>(props.left);

watch(isChecked, (newValue) => {
  activeValue.value = newValue ? props.right : props.left;
  emit('update-active-value', activeValue.value);
});
</script>

<template>
  <div class="button-border">
    <div class="switch-button" :right-content="right">
      <input 
        class="switch-button-checkbox" 
        type="checkbox"
        v-model="isChecked"
      ></input>
      <label class="switch-button-label" for="">
        <span class="switch-button-label-span">{{ left }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.button-border {
  border: 1px solid white;
  border-radius: 1.2rem;
  width: 247px;
  padding: 3px;
}

.switch-button {
  overflow: hidden;
  text-align: center;
  font-size: 1.3rem;
  letter-spacing: 1px;
  color: white;
  position: relative;
  width: 240px;
  padding-right: 120px;
  max-height: 7vh;
}

.switch-button:before {
  content: attr(right-content);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  pointer-events: none;
}

.switch-button-checkbox {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 2;
}

.switch-button-checkbox:checked + .switch-button-label:before {
  transform: translateX(120px);
  transition: transform 300ms linear;
}

.switch-button-checkbox + .switch-button-label {
  position: relative;
  padding: 15px 0;
  display: block;
  user-select: none;
  pointer-events: none;
}

.switch-button-checkbox + .switch-button-label:before {
  content: "";
  background: var(--secondary-colour);
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 1rem;
  transform: translateX(0);
  transition: transform 300ms;
}

.switch-button-checkbox + .switch-button-label .switch-button-label-span {
  position: relative;
}
</style>