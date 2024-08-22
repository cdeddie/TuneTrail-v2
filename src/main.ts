import App                from './App.vue';
import { createApp }      from 'vue';
import { createPinia }    from 'pinia';
import { useAuthStore }   from '@/stores/authStore';
import './style.css';
import './assets/index.css';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

import { createWebHistory, createRouter } from 'vue-router';
import LandingParent                      from '@/views/LandingParent.vue'
import RecommendationParent               from '@/views/RecommendationParent.vue';
import MobileRecommendation               from '@/views/MobileRecommendation.vue';     

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