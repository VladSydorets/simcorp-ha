import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/all',
      name: 'all-articles',
      component: () => import('../views/AllArticlesView.vue'),
    },
    {
      path: '/account/:id',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('../views/ArticleView.vue'),
    },
  ],
})

export default router
