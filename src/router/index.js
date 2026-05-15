import { createRouter, createWebHistory } from 'vue-router';
import GameFinderPage from '../components/GameFinderPage.vue';
import GameDetailPage from '../components/GameDetailPage.vue';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: GameFinderPage },
    {
      path: '/top/:listSlug(best-of-year|popular-2025|all-time-250)',
      name: 'top-list',
      component: GameFinderPage,
    },
    {
      path: '/game/:id(\\d+)',
      name: 'game',
      component: GameDetailPage,
      props: true,
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});
