<script setup lang="ts">
import { shallowRef, watch }      from 'vue';
import { useDeviceStore }         from '@/stores/deviceStore';
import MobileRecommendation       from '@/views/MobileDiscover.vue';
import DesktopRecommendation      from '@/views/DesktopDiscover.vue';

const deviceStore = useDeviceStore();

const currentComponent = shallowRef(
  deviceStore.isMobile || deviceStore.isTabletPortrait
    ? MobileRecommendation
    : DesktopRecommendation
);

watch(
  () => [deviceStore.isMobile, deviceStore.isTabletPortrait], 
  ([newIsMobile, newIsTabletPortrait]) => {
    console.log(`isMobile: ${newIsMobile}, isTabletPortrait: ${newIsTabletPortrait}`);
    currentComponent.value = newIsMobile || newIsTabletPortrait
      ? MobileRecommendation
      : DesktopRecommendation;
  }
);
</script>

<template>
  <component :is="currentComponent" />
</template>
