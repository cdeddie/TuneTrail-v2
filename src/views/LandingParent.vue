<script setup lang="ts">
import { shallowRef, watch }    from 'vue';
import { useDeviceStore }       from '@/stores/deviceStore';
import DesktopLanding           from '@/views/DesktopLanding.vue';
import MobileLanding            from '@/views/MobileLanding.vue';

const deviceStore = useDeviceStore();
const currentComponent = shallowRef(deviceStore.isMobile ? MobileLanding : DesktopLanding);

watch(() => deviceStore.isMobile, (newValue) => {
  currentComponent.value = newValue ? MobileLanding : DesktopLanding;
});
</script>

<template>
  <component :is="currentComponent" />
</template>