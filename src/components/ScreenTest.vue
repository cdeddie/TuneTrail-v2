<script setup lang="ts">
import { useDeviceStore } from '@/stores/deviceStore';

const deviceStore = useDeviceStore();
</script>

<template>
  <div style="color: white;">
    <p>Screen width: {{ deviceStore.width }}</p>
    <p>Screen height: {{ deviceStore.height }}</p>
    <p>Is Mobile: {{ deviceStore.isMobile }}</p>
    <p>Is Tablet: {{ deviceStore.isTablet }}</p>
    <p>Is Desktop: {{ deviceStore.isDesktop }}</p>
    <p>Is Tablet Portrait: {{ deviceStore.isTabletPortrait }}</p>
    
    <div v-if="deviceStore.showTabletOrientationPrompt">
      Please rotate your tablet to landscape mode for the best experience.
    </div>
  </div>
</template>