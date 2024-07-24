import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Account from '../views/Account.vue';
import CalendarPage from '../views/CalendarPage.vue';
import SelectTimePage from '../views/SelectTimePage.vue'
import PlansPage from '@/views/PlansPage.vue';
import PaymentPage from '@/views/PaymentPage.vue';
import CancelPage from '../views/CancelPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarPage
  },
  {
    path: '/select-time',
    name: 'SelectTime',
    component: SelectTimePage,
  },
  {
    path: '/planos',
    name: 'Planos',
    component: PlansPage,
  },
  {
    path: '/pagamento',
    name: 'Pagamento',
    component: PaymentPage,
  },
  {
    path: '/cancel',
    name: 'Cancel',
    component: CancelPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    if (!token) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
