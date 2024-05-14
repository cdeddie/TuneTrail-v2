<script setup lang="ts">
const emit = defineEmits(['scroll']);

const scrollDown = (): void => {
  console.log("Emitting scroll");
  emit('scroll');
};
</script>

<template>
  <div class="landing-root">
    <span class="title">TuneTrail</span>

    <span class="dropdown" @click="scrollDown"><i class="bi bi-chevron-down"></i></span>
  </div>
</template>

<style scoped>
.landing-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.title {
  font-size: 8vw;
  font-weight: 700;
  color: rgba(43, 233, 157, 0.576);
  display: flex;
  justify-content: center;
  padding-top: 10%;
}

.dropdown {
  display: flex;
  justify-content: center;
  margin-top: auto;
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
}

.dropdown:hover {
  cursor: pointer;
  animation: jump 0.5s infinite;
}

.bi-chevron-down {
  color: white;
  font-size: 3em;
}
</style>