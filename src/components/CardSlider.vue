<script setup lang="ts">
import { ref, onMounted } from 'vue';

const items = ref<HTMLElement[]>([]);
const active = ref(3);

// JS source: https://codepen.io/hoanghodev/pen/eYxWjyW
const loadShow = () => {
  items.value[active.value].style.transform = 'none';
  items.value[active.value].style.zIndex = '1';
  items.value[active.value].style.filter = 'none';
  items.value[active.value].style.opacity = '1';

  let stt = 0;
  for (let i = active.value + 1; i < items.value.length; i++) {
    stt++;
    items.value[i].style.transform = `translateX(${120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(-1deg)`;
    items.value[i].style.zIndex = `-${stt}`;
    items.value[i].style.filter = 'blur(5px)';
    items.value[i].style.opacity = stt > 2 ? '0' : '0.6';
  }

  stt = 0;
  for (let i = active.value - 1; i >= 0; i--) {
    stt++;
    items.value[i].style.transform = `translateX(${-120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(1deg)`;
    items.value[i].style.zIndex = `-${stt}`;
    items.value[i].style.filter = 'blur(5px)';
    items.value[i].style.opacity = stt > 2 ? '0' : '0.6';
  }
};

const nextSlide = () => {
  active.value = active.value + 1 < items.value.length ? active.value + 1 : active.value;
  loadShow();
};

const prevSlide = () => {
  active.value = active.value - 1 >= 0 ? active.value - 1 : active.value;
  loadShow();
};

onMounted(() => {
  items.value = Array.from(document.querySelectorAll('.slider .item')) as HTMLElement[];
  loadShow();
});

</script>

<template>
  <div class="slider-container">
    <div class="slider">
      <div class="item">
        <h1>Slide 1</h1>
        Lorem
      </div>

      <div class="item">
        <h1>Slide 2</h1>
        Ipsum
      </div>

      <div class="item">
        <h1>Slide 3</h1>
        Lorem
      </div>

      <div class="item">
        <h1>Slide 4</h1>
        Ipsum
      </div>

      <div class="item">
        <h1>Slide 5</h1>
        Lorem
      </div>

      <div class="item">
        <h1>Slide 6</h1>
        Ipsum
      </div>

      <div class="button-container">
        <button id="next" @click="nextSlide">></button>
        <button id="prev" @click="prevSlide"><</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item {
  margin-bottom: 20vh;
  width: 26vh;
  height: 26vh;
  position: absolute;
  background-color: rgba(60, 123, 168, 0.745);
  transition:  0.5s;
  padding: 2%;
  text-align: center;
}

.button-container {
  display: flex;
  justify-content: center;
}

#next {
  margin-left: 3rem;
}

#prev {
  margin-right: 3rem;
}

#next, #prev {
  position: absolute;
  top: 60%;
  color: #d2d2d2;
  background: none;
  border: none;
  font-size: xxx-large;
  font-family: monospace;
  font-weight: bold;
  opacity: 0.8;
}

button:hover {
  cursor: pointer;
}

@media (min-width: 2000px) {
  .slider {
    height: 40vh;
  }
  .item {
    margin-top: 10vh;
    height: 15vh;
    width: 15vh;
  }

  #next {
    margin-top: 50px;
  }

  #prev {
    margin-top: 50px;
  }
} 
</style>