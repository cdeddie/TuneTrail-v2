<script setup lang="ts">
import { shallowRef, watch }      from 'vue';
import { useDeviceStore }         from '@/stores/deviceStore';
import NewMobileDiscover          from '@/views/NewMobileDiscover.vue';
import DesktopDiscover            from '@/views/NewDesktopDiscover.vue';

const deviceStore = useDeviceStore();

const currentComponent = shallowRef(
  deviceStore.isMobile || deviceStore.isTabletPortrait
    ? NewMobileDiscover
    : DesktopDiscover
);

watch(
  () => [deviceStore.isMobile, deviceStore.isTabletPortrait], 
  ([newIsMobile, newIsTabletPortrait]) => {
    // console.log(`isMobile: ${newIsMobile}, isTabletPortrait: ${newIsTabletPortrait}`);
    currentComponent.value = newIsMobile || newIsTabletPortrait
      ? NewMobileDiscover
      : DesktopDiscover;
  }
);
</script>

<template>
  <component :is="currentComponent" />
</template>
