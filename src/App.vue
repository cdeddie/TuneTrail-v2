<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import AppStarBackground from './components/AppStarBackground.vue';
import Landing from './components/Landing.vue';
import SpotifyCharts from './components/SpotifyCharts.vue';
import FloatingNav from './components/FloatingNav.vue';
import Recommendation from './components/Recommendation.vue';

const scrollTargetRef = ref<HTMLElement | null>(null);            // Target Ref for down chevron scroll button on Landing page

// Observer for current section. Note that the activeSection ref can be null (due to observers)
const activeSection = ref<string>('Landing');

const observerCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      activeSection.value = entry.target.id;
    }
  });
};

const observerOptions = {
  rootMargin: '-50% 0px',
  threshold: 0,
};

let observer: IntersectionObserver | null = null;

// Scrolling of down chevron button on Landing
// TODO: Make a function for ignoring observer in logic, DRY
const handleScrollDown = (): void => {
  if (scrollTargetRef.value) {
    observer?.disconnect();
    scrollTargetRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        observer?.observe(section);
      });
    }, 500);
  }
};

// Scrolling of button click on floating navbar
// section: string is automatically included in the template, if the emit includes a section: string
const handleNavScroll = (section: string): void => {
  const sectionElement = document.getElementById(section);
  if (sectionElement) {
    observer?.disconnect();
    sectionElement.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        observer?.observe(section);
      });
    }, 500);
  }
};

onMounted((): void => {
  // Fixing reload scroll location issue
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 2);
  // Determining active section
  observer = new IntersectionObserver(observerCallback, observerOptions);

  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    observer?.observe(section);
  });
});

onUnmounted((): void => {
  observer?.disconnect();
});
</script>

<template>
  <div class="root">
    <AppStarBackground />
    <FloatingNav :pActiveSection="activeSection" @section-change="handleNavScroll" />
    <div class="content">
      <section id="Landing">
        <Landing @scroll-down="handleScrollDown" />
      </section>

      <section id="Charts" ref="scrollTargetRef">
        <SpotifyCharts />
      </section>

      <section id="Recommendation">
        <Recommendation />
      </section>
    </div>
  </div>
</template>

<style scoped>
.root {
  position: relative;
  min-height: var(--app-height);
}

.content {
  position: relative;
  z-index: 1;
}
</style>
