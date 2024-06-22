<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

</script>

<template>
  <ToggleGroup type="single" class="user-root">
    <ToggleGroupItem value="bold" aria-label="Toggle user">
      <i class="bi bi-person"></i>
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Toggle settings">
      <i class="bi bi-gear-wide-connected"></i>
    </ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Toggle filter">
      <i class="bi bi-funnel"></i>
    </ToggleGroupItem>
  </ToggleGroup>

</template>

<style scoped>
.user-root {
  background: rgba(180, 180, 180, .5);
  display: flex;
  flex-direction: row;
  height: 5vh;
}

.user-root button {
  padding: 0 10px;
}

i {
  font-size: 1.5rem;
}

</style>