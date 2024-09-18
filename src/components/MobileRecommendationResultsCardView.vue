<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed }    from 'vue';
import MobileRecommendationCard                         from './MobileRecommendationCard.vue';
import Swiper                                           from 'swiper';
import { EffectCoverflow }                              from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const props = defineProps<{
  recommendationData: any,
}>();

const currentTrackIndex = ref<number>(0);

const tracks = computed(() => {
  if (props.recommendationData && props.recommendationData.tracks) {
    return props.recommendationData.tracks;
  } else {
    return [];
  }
});

// Core swiper logic
let swiper: Swiper;
onMounted(() => {
  initializeSwiper();
});

const initializeSwiper = (): void => {
  swiper = new Swiper('.swiper', {
    modules: [EffectCoverflow],
    effect: 'coverflow',
    rewind: true,
    observer: true,
    centeredSlides: true,
    initialSlide: currentTrackIndex.value,
    slidesPerView: 'auto',
    allowTouchMove: true,
    spaceBetween: 40,
    coverflowEffect: {
      rotate: 25,
      stretch: 0,
      depth: 50,
      modifier: 1,
      slideShadows: false,
    },
    navigation: {
      nextEl: '.forward',
      prevEl: '.backward',
    },
  });

  swiper.on('slideChange', () => {
    currentTrackIndex.value = swiper.activeIndex;
  });
};

watch(() => props.recommendationData, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (swiper) {
      swiper.destroy();
    }
    initializeSwiper();
  }
});

const playNextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.value.length;
  swiper.slideNext();
};

const playPreviousTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.value.length) % tracks.value.length;
  swiper.slidePrev();
};
</script>

<template>
  <div class="mobile-card-view">
    <div class="swiper">
      <div class="swiper-wrapper">
        <MobileRecommendationCard 
          v-for="(track) in tracks"
          :track="track" 
          class="swiper-slide card"
          @play-next="playNextTrack"
          @play-prev="playPreviousTrack"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 80%;
  min-height: 60vh;
}

.mobile-card-view {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
}

.swiper-3d {
  perspective: 550px;
}
</style>