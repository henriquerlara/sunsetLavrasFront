import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Account from '../views/Account.vue';
import CalendarPage from '../views/avulso/CalendarPage.vue';
import SelectTimePage from '../views/avulso/SelectTimePage.vue';
import PlansPage from '@/views/PlansPage.vue';
import PaymentPage from '@/views/PaymentPage.vue';
import CancelPage from '../views/CancelPage.vue';
import PlanosDescricaoPage from '@/views/PlanosDescricaoPage.vue';
import store from '../store'; // Importe o Vuex store
import axios from 'axios';
import SelectDayPage from '../views/mensal/SelectDayPage.vue';
import SelectTimeMensalPage from '../views/mensal/SelectTimeMensalPage.vue';
import SuccessPage from '@/views/SuccessPage.vue';
import PrivacyPolicy from '@/views/Privacy.vue'
import TermsOfService from '@/views/Terms.vue'
import ResetPassword from '@/views/ResetPassword.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';

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
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/select-time',
    name: 'SelectTime',
    component: SelectTimePage,
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
  },
  {
    path: '/cancel',
    name: 'Cancel',
    component: CancelPage,
  },
  {
    path: '/planosView',
    name: 'PlanosDescricaoPage',
    component: PlanosDescricaoPage,
  },
  {
    path: '/dias',
    name: 'SelectDayPage',
    component: SelectDayPage,
  },
  {
    path: '/select-time-mensal',
    name: 'SelectTimeMensal',
    component: SelectTimeMensalPage,
  },
  {
    path: '/success',
    name: 'SuccessPage',
    component: SuccessPage,
  },
  {
    path: '/terms',
    name: 'TermsOfService',
    component: TermsOfService,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
  path: '/privacy',
  name: 'PrivacyPolicy',
  component: PrivacyPolicy,
},
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    axios.get('http://localhost:3000/account', { withCredentials: true })
      .then(response => {
        if (response.data.isAuthenticated) {
          store.commit('setAuthentication', true);
          next();
        } else {
          store.commit('setAuthentication', false);
          alert('Faça login primeiro.');
          next({ name: 'login' });
        }
      })
      .catch(() => {
        store.commit('setAuthentication', false);
        alert('Faça login primeiro.');
        next({ name: 'login' });
      });
  } else {
    next();
  }
});

export default router;
