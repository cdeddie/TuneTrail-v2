import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import './style.css';
import './assets/index.css';
import { createWebHistory, createRouter } from 'vue-router';
import LandingParent from '@/views/LandingParent.vue'
import RecommendationParent from '@/views/RecommendationParent.vue';    

async function initializeApp() {
  const app = createApp(App);

  const pinia = createPinia();
  app.use(pinia);

  const routes = [
    { path: '/', name: 'home', component: LandingParent },
    { path: '/discover', name: 'discover', component: RecommendationParent }
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  app.use(router);

  const authStore = useAuthStore();
  await authStore.checkLoginStatus();

  app.mount('#app');
}

initializeApp().catch(error => {
  console.error('Failed to initialize the app:', error);
});