// src/store/index.ts
import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    selectedDate: null as Date | null,
    selectedWeekDay: '' as string,
    selectedDates: [] as Date[],
    isAuthenticated: false, // Estado para gerenciar a autenticação
    usuario: null as any, // Adicionando o estado de usuário
  },
  mutations: {
    setSelectedDate(state, date: Date) {
      state.selectedDate = date;
    },
    setSelectedWeekDay(state, day: string) {
      state.selectedWeekDay = day;
    },
    setSelectedDates(state, dates: Date[]) {
      state.selectedDates = dates;
    },
    setAuthentication(state, status: boolean) {
      state.isAuthenticated = status;
    },
    setUsuario(state, usuario: any) { // Adicionando a mutação de usuário
      console.log('Setting usuario:', usuario); // Log para depuração
      state.usuario = usuario;
    },
  },
  actions: {
    async fetchUsuario({ commit }) {
      try {
        console.log('Fetching user data...');
        const response = await axios.get('http://localhost:3000/account', { withCredentials: true });
        console.log('User data fetched:', response.data); // Log para depuração
        commit('setUsuario', response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  },
  modules: {}
});
