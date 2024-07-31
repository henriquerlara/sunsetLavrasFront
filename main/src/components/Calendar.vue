<template>
  <div class="calendar-view">
    <v-calendar
      :style="{ width: '700px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', border: '2px solid #ccc', borderRadius: '10px' }"
      is-expanded
      :attributes="attrs"
      :min-date="today"
      :max-date="maxDate"
      @dayclick="onDayClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import dayjs from 'dayjs';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'CalendarView',
  setup() {
    const store = useStore();
    const today = dayjs().startOf('day').toDate();
    const maxDate = dayjs().add(6, 'day').endOf('day').toDate(); // Adiciona 7 dias a partir de hoje

    const selectedDate = computed(() => store.state.selectedDate);

    const attrs = computed(() => [
      {
        key: 'today',
        dot: 'red',
        dates: new Date(),
      },
      {
        key: 'selectedDate',
        dates: selectedDate.value,
        highlight: true,
      },
    ]);

    const onDayClick = (day: any) => {
      const date = dayjs(day.date).startOf('day');

      if (date.isBefore(today) || date.isAfter(maxDate)) {
        alert('A data selecionada está fora do intervalo permitido.');
        return;
      }

      if (selectedDate.value && dayjs(selectedDate.value).isSame(date, 'day')) {
        store.commit('setSelectedDate', null); // Deselecionar a data
      } else {
        store.commit('setSelectedDate', date.toDate()); // Selecionar a data
      }
    };

    return {
      attrs,
      onDayClick,
      today,
      maxDate,
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
