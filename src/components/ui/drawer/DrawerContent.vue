<script lang="ts" setup>
import { DrawerContent, DrawerPortal } from 'vaul-vue'
import type { DialogContentEmits, DialogContentProps } from 'radix-vue'
import { useForwardPropsEmits } from 'radix-vue'
import type { HtmlHTMLAttributes } from 'vue'
import DrawerOverlay from './DrawerOverlay.vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogContentProps & { class?: HtmlHTMLAttributes['class'] }>()
const emits = defineEmits<DialogContentEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent
      v-bind="forwarded" :class="cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border drawer-bg',
        props.class,
      )"
      class="drawer-content"
    >
      <div class="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      <slot />
    </DrawerContent>
  </DrawerPortal>
</template>

<style scoped>
.drawer-bg {
  background-color: rgba(23,23,23);
  transition: .5s display background-color ease;
}

.border {
  border-color: black !important;
  border-width: 2px !important;
}
</style>