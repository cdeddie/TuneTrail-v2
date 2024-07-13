import App              from './App.vue';
import { createApp }    from 'vue';
import { createPinia }  from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import './style.css';
import './assets/index.css';

import { createWebHistory, createRouter } from 'vue-router';
import Landing                            from '@/views/Landing.vue';
import RecommendationView                 from '@/views/RecommendationView.vue';

const app = createApp(App);

const routes = [
  { path: '/', component: Landing },
  { path: '/discover', component: RecommendationView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);

const pinia = createPinia();
app.use(pinia);

const authStore = useAuthStore();
await authStore.checkLoginStatus();

app.mount('#app');