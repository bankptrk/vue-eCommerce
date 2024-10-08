import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/user/HomeView.vue';
import SearchView from '@/views/user/SearchView.vue';
import CartView from '@/views/user/CartView.vue';
import ProfileView from '@/views/user/ProfileView.vue';
import SuccessView from '@/views/user/SuccessView.vue';
import CheckoutView from '@/views/user/CheckoutView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
    },
    {
      path: '/success',
      name: 'success',
      component: SuccessView,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
  ],
});

export default router;
