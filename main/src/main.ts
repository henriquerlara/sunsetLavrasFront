import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Se estiver usando Vuex
import './assets/global.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);
app.use(store); // Se estiver usando Vuex
app.mount('#app');
