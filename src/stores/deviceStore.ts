import { defineStore }    from 'pinia';
import { ref, computed }  from 'vue';

type DeviceInfo = {
  isMobile:   boolean;
  isTablet:   boolean;
  isDesktop:  boolean;
}

export const useDeviceStore = defineStore('device', () => {
  const width = ref<number>(window.innerWidth);
  const height = ref<number>(window.innerHeight);

  const MOBILE_BREAKPOINT = 769;
  const TABLET_BREAKPOINT = 1033;

  const updateDimensions = (): void => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  const detectDevice = (): DeviceInfo => {
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const isMobile = width.value < MOBILE_BREAKPOINT;
    const isTablet = hasTouchScreen && width.value >= MOBILE_BREAKPOINT && width.value <= TABLET_BREAKPOINT;
    const isDesktop = width.value >= TABLET_BREAKPOINT && width > height;

    return { isMobile, isTablet, isDesktop };
  };

  const deviceInfo = ref<DeviceInfo>(detectDevice());

  const isMobile = computed(() => deviceInfo.value.isMobile);
  const isTablet = computed(() => deviceInfo.value.isTablet);
  const isDesktop = computed(() => deviceInfo.value.isDesktop);
  const isTabletPortrait = computed(() => isTablet.value && height.value > width.value);
  const showTabletOrientationPrompt = computed(() => isTablet.value && isTabletPortrait.value);

  window.addEventListener('resize', () => {
    updateDimensions();
    deviceInfo.value = detectDevice();
  });

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isTabletPortrait,
    showTabletOrientationPrompt,
  };
});