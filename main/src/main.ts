import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Se estiver usando Vuex
import axios from 'axios';
import './assets/global.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

axios.defaults.baseURL = 'http://localhost:3000/api';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);
app.use(store); // Se estiver usando Vuex
app.mount('#app');
