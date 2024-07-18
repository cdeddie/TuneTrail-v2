import App                from './App.vue';
import { createApp }      from 'vue';
import { createPinia }    from 'pinia';
import { useAuthStore }   from '@/stores/authStore';
import { useDeviceStore } from '@/stores/deviceStore';
import './style.css';
import './assets/index.css';

import { createWebHistory, createRouter } from 'vue-router';
import Landing                            from '@/views/Landing.vue';
import MobileLanding                      from '@/views/MobileLanding.vue';
import RecommendationView                 from '@/views/RecommendationView.vue';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const deviceStore = useDeviceStore();

const routes = [
  { path: '/', component: deviceStore.isMobile ? MobileLanding : Landing },
  { path: '/discover', component: RecommendationView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);

const authStore = useAuthStore();
await authStore.checkLoginStatus();

app.mount('#app');