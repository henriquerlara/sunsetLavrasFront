import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Se estiver usando Vuex
import './assets/global.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css'; // Importar o CSS do v-calendar

library.add(fas);

const app = createApp(App);

setupCalendar(app, {
    locales: {
      'pt-BR': {
        firstDayOfWeek: 1, // Configuração para o início da semana
      },
    },
  });

app.component('font-awesome-icon', FontAwesomeIcon);
app.component('VCalendar', Calendar);
app.component('VDatePicker', DatePicker);

app.use(router);
app.use(store); // Se estiver usando Vuex
app.mount('#app')