import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/user/HomeView.vue';
import SearchView from '@/views/user/SearchView.vue';
import CartView from '@/views/user/CartView.vue';
import ProfileView from '@/views/user/ProfileView.vue';
import SuccessView from '@/views/user/SuccessView.vue';
import CheckoutView from '@/views/user/CheckoutView.vue';

import AdminLogin from '@/views/admin/LoginView.vue';
import AdminDashboard from '@/views/admin/DashboardView.vue';

import AdminProductList from '@/views/admin/product/ListView.vue';
import AdminProductUpdate from '@/views/admin/product/UpdateView.vue';

import AdminUserList from '@/views/admin/user/ListView.vue';
import AdminUserUpdate from '@/views/admin/user/UpdateView.vue';

import AdminOrderList from '@/views/admin/order/ListView.vue';
import AdminOrdertDetail from '@/views/admin/order/DetailView.vue';

import { useAccountStore } from '@/stores/account';

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
    {
      path: '/admin/login',
      name: 'login',
      component: AdminLogin,
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard,
    },
    {
      path: '/admin/product/create',
      name: 'admin-product-create',
      component: AdminProductUpdate,
    },
    {
      path: '/admin/product/update/:id',
      name: 'admin-product-update',
      component: AdminProductUpdate,
    },
    {
      path: '/admin/products',
      name: 'admin-product-list',
      component: AdminProductList,
    },
    {
      path: '/admin/users',
      name: 'admin-users-list',
      component: AdminUserList,
    },
    {
      path: '/admin/users/update/:id',
      name: 'admin-user-update',
      component: AdminUserUpdate,
    },
    ,
    {
      path: '/admin/orders',
      name: 'admin-order-list',
      component: AdminOrderList,
    },
    {
      path: '/admin/orders/detail/:id',
      name: 'admin-orders-detail',
      component: AdminOrdertDetail,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const accountStore = useAccountStore();
  await accountStore.checkAuth();
  if (to.name.includes('admin') && !accountStore.isAdmin) {
    next({ name: 'home' });
  } else if (to.name === 'login' && accountStore.isAdmin) {
    next({ name: 'admin-dashboard' });
  } else if (to.name === 'profile' && !accountStore.isLoggedIn) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
