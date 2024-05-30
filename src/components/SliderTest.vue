<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from '@/components/ui/slider'

const modelValue = ref<number>(50);
</script>

<template>
  <Slider class="slider" v-model="modelValue" :default-value="[33]" :max="100" :step="1" />
</template>

<styled scoped>


</styled>