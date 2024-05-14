<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  });

  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el) => observer.observe(el));
});
</script>

<template>
  <div class="charts-root">
    <div class="title">What's Charting?</div>

    <section class="hidden">
      <p>Wow!</p>
    </section>

    <section class="hidden">
      <p>Australia!</p>
    </section>

    <section class="hidden">
      <p>Another one!</p>
    </section>
  </div>
</template>

<style scoped>
section {
  display: grid;
  place-items: center;
  align-content: center;
  font-size: 30px;
  font-weight: 700;
  color: white;
}

.hidden {
  opacity: 0;
  filter: blur(5px);
  transform: translateX(-100%);
  transition: all 2s;
  margin-bottom: 10vh;
}

.show {
  opacity: 1;
  filter: blur(0);
  transform: translateX(0);
}

.charts-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.title {
  font-size: 5vw;
  font-weight: 750;
  color: rgba(211, 233, 224, 0.576);
  margin-left: auto;
  margin-right: auto;
}
</style>