<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const emit = defineEmits<{ (event: 'section-change', section: string): void; }>();
const props = defineProps<{ pActiveSection: string }>();

const windowPosition = ref<number>(0);      // Window position Y value
const activeIndex = ref<number>(-1);        // Starting with no active index
const items: string[] = ['Landing', 'Charts', 'Recommendation', 'Personal'];

watch(activeIndex, (newIndex) => {
  if (activeIndex.value > -1 && newIndex < items.length) {
    emit('section-change', <string>items[newIndex]); // Emits the actual string value in the items array
  }
});

watch(() => props.pActiveSection, (newSection) => {
  if (newSection) {
    const index = items.indexOf(newSection);
    activeIndex.value = index;
  }
})

const handleScroll = (): void => {
  windowPosition.value = window.scrollY;
};

const setActiveIndex = (index: number): void => {
  activeIndex.value = index;
  emit('section-change', items[index]);
};

onMounted((): void => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted((): void => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="floating-container" :class="{ 'fade-in': !(windowPosition < 125) }">
    <div class="navbar">
      <span
        v-for="(item, index) in items"
        :key="item"
        :class="{ active: activeIndex === index }"
        @click="setActiveIndex(index)"
        :style="item === 'Recommendation' ? { padding: '20px 2px' } : {}"
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.floating-container {
  position: fixed;
  bottom: 20px;
  max-width: 30vw;
  left: 25%;
  right: 25%;
  margin-left: auto;
  margin-right: auto;
  background-color: rgba(17, 17, 17, 0.85);
  color: white;
  border-radius: .75vw;
  opacity: 0;
  transition: opacity .75s ease;
  z-index: 9999;
  pointer-events: none;
  padding: 5px;
}

@media (max-width: 1050px) {
  .floating-container {
    left: 20%;
    right: 20%;
  }
}

.fade-in {
  opacity: 1;
  pointer-events: auto;
}

.navbar {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

.navbar span {
  font-family: Circular;
  text-align: center;
  border: 1px rgba(17, 17, 17, 0.595);
  transition: border-color 0.5s ease-in-out;
  padding: 20px 15px;
  border: 1px solid rgba(188, 188, 188, 0.097);
  border-radius: .5vw;
  box-sizing: border-box;
  flex-grow: 1;
  margin: 0px 2px;
  font-weight: 650;
}

.navbar span:hover {
  cursor: pointer;
  border: 1px solid white;
  border-radius: .5vw;
}

.navbar span.active {
  border: 1px solid white;
  border-radius: .5vw;
}
</style>