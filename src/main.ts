import { createApp } from 'vue';
import './style.css';
import './assets/index.css';
import App from './App.vue';

import { createWebHistory, createRouter } from 'vue-router';
import Landing from '@/views/Landing.vue';

const routes = [
  { path: '/', component: Landing }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App)
  .use(router)
  .mount('#app');