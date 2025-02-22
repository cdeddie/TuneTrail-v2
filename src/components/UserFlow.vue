<script setup lang="ts">
import { 
  ref, 
  onMounted, 
  onUnmounted, 
  nextTick,
  ComponentPublicInstance
 } from 'vue';
import FilterDropdown     from './DropdownFilter.vue';
import SettingsDropdown   from './DropdownSettings.vue';
import AuthDropdown       from './DropdownAuth.vue';
import { useAuthStore }   from '@/stores/authStore';

// The logic for this component is contained within the child components. 
// This component simply provides a frontend for the user flow portion

const authStore = useAuthStore();

const activeDropdown = ref<string | null>(null);
const dropdownRefs = ref<{ [key: string]: HTMLElement | null }>({
  filters: null,
  settings: null,
  profile: null,
});

const toggleDropdown = async (dropdown: string) => {
  if (activeDropdown.value === dropdown) {
    // Close the dropdown if clicked on again
    activeDropdown.value = null;
  } else {
    // Otherwise open dropdown
    activeDropdown.value = dropdown;
    await nextTick();
    positionDropdown(dropdown);
  }
};

const positionDropdown = (dropdown: string) => {
  const dropdownElement = dropdownRefs.value[dropdown];
  if (dropdownElement) {
    const rect = dropdownElement.getBoundingClientRect();

    dropdownElement.style.position = 'fixed';
    dropdownElement.style.right = '10px';
    dropdownElement.style.left = 'auto';
    dropdownElement.style.top = `calc(${rect.top}px + 1px)`;
  }
};

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as Element;
  if (!target.closest('.user-root')) {
    if (filterDialogOpen.value === true) {
      return;
    }
    activeDropdown.value = null;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', closeDropdown);
});

const setDropdownRef = (el: Element | ComponentPublicInstance | null, item: string) => {
  if (el && 'nodeType' in el) {
    dropdownRefs.value[item] = el as HTMLElement;
  }
};

const filterDialogOpen = ref<boolean>(false);
</script>

<template>
  <div class="user-root">
    <div class="dropdown-container" v-for="item in ['filters', 'settings', 'profile']" :key="item">
      <div 
        class="icon-container" 
        :class="{ active: activeDropdown === item }"
        @click.stop="toggleDropdown(item)"
      >
        <template v-if="item === 'profile' && authStore.userDetails && authStore.userDetails.images && authStore.userDetails.images.length > 0">
          <img :src="authStore.userDetails?.images[0].url" class="profile-image" />
        </template>
        <template v-else>
          <i :class="`bi bi-${item === 'settings' ? 'gear-wide-connected' : item === 'filters' ? 'funnel' : 'person'}`"></i>
        </template>
      </div>
      <transition name="fade">
        <div v-if="activeDropdown === item" class="dropdown" :ref="el => setDropdownRef(el, item)">
          <FilterDropdown v-model="filterDialogOpen" v-if="item === 'filters'" />
          <SettingsDropdown v-if="item === 'settings'" />
          <AuthDropdown v-if="item === 'profile'" />
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.user-root {
  background-color: rgb(33, 33, 33);
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
  background-color: rgba(65, 64, 64, 0.417);
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
  z-index: 10;
  margin-top: 0.5rem;
}

.profile-image {
  border-radius: 50%;
  height: 77.5%;
  border: 1px solid white;
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>