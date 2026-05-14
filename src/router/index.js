import { createRouter, createWebHistory } from 'vue-router'
import GameFinderPage from '../components/GameFinderPage.vue'
import GameDetailPage from '../components/GameDetailPage.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: GameFinderPage },
    { path: '/game/:id(\\d+)', name: 'game', component: GameDetailPage, props: true },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
