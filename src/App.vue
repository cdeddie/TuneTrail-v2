<script setup lang="ts">
import { TooltipProvider } from 'radix-vue';
import { Toaster} from 'vue-sonner';
</script>

<template>
  <Toaster closeButton :visibleToasts="1" />
  <TooltipProvider>
    <main class="app-root">
      <RouterView />
    </main>
  </TooltipProvider>
</template>

<style scoped>
.app-root {
  height: 100vh;
}
</style>
