import { defineStore }  from 'pinia';
import { ref }          from 'vue';

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

export const useAuthStore = defineStore('AuthStore', () => {
  const isLoggedIn = ref<boolean>(false);

  const checkLoginStatus = async () => {
    try {
      const url = `${baseUrl}/api/auth/status`;
      const response = await fetch(url, { credentials: 'include' });
      const loginData = await response.json();
      isLoggedIn.value = loginData.isLoggedIn;
    } catch (error) {
      console.error('Failed to check login status:', error);
    }
  };

  const setLoginStatus = (status: boolean) => {
    isLoggedIn.value = status;
  }

  return {
    isLoggedIn,
    checkLoginStatus,
    setLoginStatus
  }
});