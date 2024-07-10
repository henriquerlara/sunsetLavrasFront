import "./assets/global.css";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Se estiver usando Vuex

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSignInAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Importe os ícones que você deseja usar

library.add(faSignInAlt, faUserCircle); // Adicione os ícones à biblioteca

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon); // Registre o componente globalmente

app.use(router);
app.use(store); // Se estiver usando Vuex

app.mount('#app');
