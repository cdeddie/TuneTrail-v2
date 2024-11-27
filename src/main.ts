import App              from './App.vue';
import { createApp }    from 'vue';
import { createPinia }  from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import './style.css';
import './assets/index.css';

import { createWebHistory, createRouter } from 'vue-router';
import DiscoverParent                     from '@/views/DiscoverParent.vue';
import NewLanding                         from './views/NewLanding.vue';

// For maintaining previous recommendation data after login
if (window.location.search.includes('spotifyLogin=true')) {
  sessionStorage.setItem('spotifyLogin', 'true');

  const url = new URL(window.location.href);
  url.searchParams.delete('spotifyLogin');
  window.history.replaceState(null, '', url.toString());
} else {
  const removalKeys = ['trackTags', 'artistTags', 'trackRecommendations', 'artistRecommendations'];
  removalKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
}

const initializeApp = async() => {
  const app = createApp(App);

  const pinia = createPinia();
  app.use(pinia);

  const routes = [
    { path: '/', name: 'home', component: NewLanding },
    { path: '/discover', name: 'discover', component: DiscoverParent },
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