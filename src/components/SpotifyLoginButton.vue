<script setup lang="ts">

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

const redirectToLogin = () => {
  const currentUrl = window.location.href;
  window.location.replace(`${baseUrl}/api/auth/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
};
</script>

<template>
  <div class="spotify-login">
    <div class="login-button">
      <button @click="redirectToLogin">
        <i class="bi bi-spotify" style="margin-right: 4px;"></i>
        <span style="font-weight: bold;"> Login</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.spotify-login {
  border: 2px solid black;
  border-radius: 1rem;
  background-color: rgb(36, 215, 96);
  transition: transform 0.3s ease, filter 0.3s ease;
}

.spotify-login:hover {
  cursor: pointer;
  filter: brightness(1.1);
  transform: translateY(-2.5px);
}

.login-button {
  padding: 4px 20px;
}
</style>