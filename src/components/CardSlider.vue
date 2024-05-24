<script setup lang="ts">
import { ref, onMounted } from 'vue';

const items = ref<HTMLElement[]>([]);
const active = ref(3);

// Js source: https://codepen.io/hoanghodev/pen/eYxWjyW
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
        <h1>Slide 3</h1>
        Ipsum
      </div>

      <div class="item">
        <h1>Slide 4</h1>
        Lorem
      </div>

      <div class="item">
        <h1>Slide 5</h1>
        Ipsum
      </div>

      <button id="next" @click="nextSlide">></button>
      <button id="prev" @click="prevSlide"><</button>
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
  margin-top: 100px;
  height: 50vh;
  overflow: hidden;
}

.item {
  width: 30vw;
  position: absolute;
  text-align: justify;
  background-color: rgba(60, 123, 168, 0.745);
  transition:  0.5s;
  left: calc(50% - 15vw);
}

#next {
  right: 40vw;
}

#prev {
  left: 40vw;
}

#next, #prev {
  position: absolute;
  top: 40%;
  color: #323232;
  background: none;
  border: none;
  font-size: xxx-large;
  font-family: monospace;
  font-weight: bold;
  opacity: 0.5;
  transition: opacity 0.5s;
}
</style>