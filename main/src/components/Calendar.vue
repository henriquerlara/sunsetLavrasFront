<template>
  <div class="calendar-view">
    <v-calendar
      :style="{ width: '700px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', border: '2px solid #ccc', borderRadius: '10px' }"
      is-expanded
      :attributes="attrs"
      :min-date="today"
      @dayclick="onDayClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import dayjs from 'dayjs';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'CalendarView',
  setup() {
    const store = useStore();
    const today = dayjs().startOf('day').toDate();

    const attrs = ref([
      {
        key: 'today',
        dot: 'red',
        dates: new Date(),
      },
      {
        key: 'selectedDates',
        dates: store.state.selectedDates,
        highlight: true,
      },
    ]);

    const onDayClick = (day: any) => {
      const date = dayjs(day.date).startOf('day');

      if (date.isBefore(today)) {
        alert('Não é possível selecionar um dia anterior ao de hoje.');
        return;
      }

      const selectedDates = store.state.selectedDates as Date[];
      const index = selectedDates.findIndex((d: Date) => dayjs(d).isSame(date, 'day'));

      if (index === -1) {
        selectedDates.push(date.toDate()); // Selecionar a data
      } else {
        selectedDates.splice(index, 1); // Deselecionar a data
      }

      store.commit('setSelectedDates', selectedDates); // Atualizar o estado no Vuex
    };

    return {
      attrs,
      onDayClick,
      today,
    };
  },
});
</script>

<style scoped>
.calendar-view {
  padding: 40px;
  width: 100%;
}

.custom-calendar .vc-title {
  font-size: 24px; /* Ajuste o tamanho da fonte do título */
}
</style>
