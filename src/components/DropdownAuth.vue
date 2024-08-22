<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

const redirectToLogin = () => {
  window.location.replace(`${baseUrl}/auth/login`);
};

const logoutAndRefresh = async () => {
  try {
    const response = await fetch('http://localhost:3443/auth/logout', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      location.reload();
      authStore.setLoginStatus(false);
    } else {
      console.error('Logout failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
</script>

<template>
  <div class="auth-dropdown-root">
    <div class="background">
      <div class="button-wrapper">
        <div v-if="!authStore.isLoggedIn" class="log" @click="redirectToLogin">
          <i class="bi bi-spotify"></i>
          <span> Login</span>
        </div>
        <div v-else class="log" @click="logoutAndRefresh">
          <i class="bi bi-box-arrow-left"></i>
          <span> Logout</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-dropdown-root {
  background-color: rgb(37, 37, 37);
  padding: 7px;
  border-radius: .95rem;
  color: white;
}

.background {
  background-color: rgba(0, 0, 0, 0.667);
  padding: 15px 30px;
  border-radius: .9rem;
}

.button-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--secondary-colour);
  border-radius: 1rem;
  width: fit-content;
  padding: 5px 15px;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.button-wrapper span {
  margin-left: 7px;
  display: inline-block;
  white-space: nowrap;
}

.button-wrapper:hover {
  cursor: pointer;
  filter: brightness(1.2);
  transform: translateY(-2.5px);
}

.log {
  display: flex;
  flex-direction: row;
}
</style>