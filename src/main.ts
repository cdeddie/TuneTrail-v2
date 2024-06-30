import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import './assets/index.css';
import App from './App.vue';

import { createWebHistory, createRouter } from 'vue-router';
import Landing from '@/views/Landing.vue';
import RecommendationView from '@/views/RecommendationView.vue';

const routes = [
  { path: '/', component: Landing },
  { path: '/discover', component: RecommendationView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();
createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app');