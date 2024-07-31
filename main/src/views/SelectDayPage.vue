<template>
  <div class="select-day-page">
    <HomeIcon />
    <h1>Escolha o dia da semana para o seu plano</h1>
    <div class="container">
      <select v-model="selectedDay" class="dropdown">
        <option disabled value="">Selecione um dia</option>
        <option v-for="(day, index) in daysOfWeek" :key="index" :value="index">
          {{ day }}
        </option>
      </select>
      <button @click="goToSelectTime" class="next-button">Próximo</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import HomeIcon from '../components/HomeIcon.vue';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'SelectDayPage',
  components: {
    HomeIcon
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const selectedDay = ref<number | null>(null);

    const getNextOccurrences = (dayIndex: number): Date[] => {
      const today = dayjs().startOf('day');
      const currentDayOfWeek = today.day();
      const occurrences = [];

      for (let i = 1; i <= 4; i++) {
        let nextOccurrence = today.day(dayIndex);
        if (dayIndex <= currentDayOfWeek) {
          nextOccurrence = nextOccurrence.add(i, 'week');
        } else {
          nextOccurrence = nextOccurrence.add(i - 1, 'week');
        }
        occurrences.push(nextOccurrence.toDate());
      }

      return occurrences;
    };

    const goToSelectTime = () => {
      if (selectedDay.value !== null) {
        const nextOccurrences = getNextOccurrences(selectedDay.value);
        store.commit('setSelectedDates', nextOccurrences);
        router.push({ name: 'SelectTimeMensal' });
      } else {
        alert('Por favor, selecione um dia da semana.');
      }
    };

    return {
      daysOfWeek,
      selectedDay,
      goToSelectTime
    };
  }
});
</script>

<style scoped>
.select-day-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #4300a2, #ff5858);
  color: white;
  padding: 40px 20px;
  text-align: center;
}

.container {
  background: white;
  color: #333;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-transform: uppercase;
  color: white;
}

.dropdown {
  width: 100%;
  padding: 15px;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
  border-radius: 10px;
  border: none;
  margin-bottom: 20px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.next-button {
  background: linear-gradient(to right, #4300a2, #ff5858);
  border: none;
  color: white;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.3s, transform 0.2s;
  margin-top: 30px;
}

.next-button:hover {
  background: linear-gradient(to left, #4300a2, #ff5858);
  transform: scale(1.05);
}
</style>
