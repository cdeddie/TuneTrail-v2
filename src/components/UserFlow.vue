<script setup lang="ts">
import { ref, onMounted, onUnmounted }  from 'vue';
import FilterDropdown                   from './DropdownFilter.vue';
import SettingsDropdown                 from './DropdownSettings.vue';
import AuthDropdown                     from './DropdownAuth.vue';

// The logic for this component is contained within the child components. 
// This component simply provides a frontend for the user flow portion

const activeDropdown = ref<string | null>(null);

const toggleDropdown = (dropdown: string) => {
  if (activeDropdown.value === dropdown) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = dropdown;
  }
};

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as Element;
  if (!target.closest('.user-root')) {
    activeDropdown.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<template>
  <div class="user-root">
    <div class="dropdown-container" v-for="item in ['filters', 'settings', 'profile']" :key="item">
      <div 
        class="icon-container" 
        :class="{ active: activeDropdown === item }"
        @click.stop="toggleDropdown(item)"
      >
        <i :class="`bi bi-${item === 'profile' ? 'person' : item === 'settings' ? 'gear-wide-connected' : 'funnel'}`"></i>
      </div>
      <transition name="fade">
        <div v-if="activeDropdown === item" class="dropdown">
          <FilterDropdown v-if="item === 'filters'" />
          <SettingsDropdown v-if="item === 'settings'" />
          <AuthDropdown v-if="item === 'profile'" />
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.user-root {
  background: var(--secondary-colour);
  border: 1px solid white;
  display: flex;
  flex-direction: row;
  border-radius: 3rem;
  min-height: 5vh;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.dropdown-container {
  position: relative;
  padding: 0 4px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 1rem;
  transition: background-color 0.3s ease;
}

.icon-container:hover,
.icon-container.active {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

i {
  font-size: 1.5rem;
  margin: 0 3vw;
  color: white;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  margin-top: 0.5rem;
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
</style>