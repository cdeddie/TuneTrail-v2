<script setup lang="ts">
import { shallowRef, watch }      from 'vue';
import { useDeviceStore }         from '@/stores/deviceStore';
import MobileRecommendation       from '@/views/MobileDiscover.vue';
import DesktopRecommendation      from '@/views/DesktopDiscover.vue';

const deviceStore = useDeviceStore();

const currentComponent = shallowRef(deviceStore.isMobile ? MobileRecommendation : DesktopRecommendation);

watch(() => deviceStore.isMobile, (newValue) => {
  console.log(newValue);
  currentComponent.value = newValue ? MobileRecommendation : DesktopRecommendation;
});
</script>

<template>
  <component :is="currentComponent" />
</template>