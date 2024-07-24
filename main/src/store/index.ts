import { createStore } from 'vuex';

export default createStore({
  state: {
    selectedDates: [] as Date[], // Estado para armazenar as datas selecionadas
  },
  mutations: {
    setSelectedDates(state, dates: Date[]) {
      state.selectedDates = dates;
    },
  },
  actions: {},
  modules: {}
});
