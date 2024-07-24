<template>
  <div v-if="hasSelectedDates" class="select-time-page">
    <h1>Selecione um horário para {{ formattedDate }}</h1>
    <div class="main-content">
      <h2>Horários disponíveis:</h2>
      <div v-for="court in courts" :key="court" :class="{ disabled: isCourtDisabled(court) }" class="court">
        <h3>Quadra {{ court }}</h3>
        <div class="times">
          <button
            v-for="time in availableTimes"
            :key="time.hour"
            :class="{ disabled: !time.available || isCourtDisabled(court), selected: isSelected(court, time.hour) }"
            @click="selectTime(court, time.hour)"
            :disabled="!time.available || isCourtDisabled(court)"
          >
            {{ time.hour }}
          </button>
        </div>
      </div>
      <p class="description">
        É possível selecionar mais de um horário, mas todos os horários devem ser para a mesma quadra.
      </p>
      <button class="next-button" @click="goToNextStep">Próximo</button>
    </div>
  </div>
  <div v-else>
    <p>Você deve selecionar uma data primeiro.</p>
    <router-link to="/">Voltar à seleção de datas</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PfufkRxlLJdQ9IhESSmTptbyyFlrIbQbBA8KComvvRgFSxKt9IUh9DmqkBIOOgx0rDGweY00GDohnCL1id9KfDH00Xgsu33QH');

interface AvailableTime {
  hour: string;
  available: boolean;
}

export default defineComponent({
  name: 'SelectTimePage',
  setup() {
    const store = useStore();
    const router = useRouter();
    const courts = [1, 2, 3, 4, 5];
    const availableTimes = ref<AvailableTime[]>([]);
    const selectedTimes = ref<{ court: number; hour: string }[]>([]);
    const activeCourt = ref<number | null>(null);

    const hasSelectedDates = computed(() => store.state.selectedDates.length > 0);
    const selectedDate = computed(() => dayjs(store.state.selectedDates[0]));
    const formattedDate = computed(() => selectedDate.value.format('DD/MM/YYYY'));

    const generateAvailableTimes = () => {
      const times = [];
      const now = dayjs();

      for (let hour = 7; hour <= 21; hour++) {
        const time = selectedDate.value.hour(hour).minute(0).second(0);
        const isAvailable = selectedDate.value.isAfter(now, 'day') || time.isAfter(now);

        times.push({
          hour: time.format('HH:mm'),
          available: isAvailable,
        });
      }
      return times;
    };

    const selectTime = (court: number, hour: string) => {
      const index = selectedTimes.value.findIndex(t => t.court === court && t.hour === hour);
      if (index === -1) {
        selectedTimes.value.push({ court, hour });
        activeCourt.value = court;
      } else {
        selectedTimes.value.splice(index, 1);
        if (selectedTimes.value.length === 0) {
          activeCourt.value = null;
        }
      }
    };

    const isSelected = (court: number, hour: string) => {
      return selectedTimes.value.some(t => t.court === court && t.hour === hour);
    };

    const isCourtDisabled = (court: number) => {
      return activeCourt.value !== null && activeCourt.value !== court;
    };

    const goToNextStep = async () => {
      const selectedHours = selectedTimes.value.map(t => t.hour);
      const selectedCourt = selectedTimes.value.length > 0 ? selectedTimes.value[0].court : null;

      try {
        const response = await axios.post('http://localhost:3000/stripe/create-checkout-session', {
          date: selectedDate.value.format('YYYY-MM-DD'),
          hours: selectedHours,
          court: selectedCourt,
          total: selectedHours.length * 80,
        });

        const sessionId = response.data.id;

        // Redirecionar para a página de pagamento do Stripe
        const stripe = await stripePromise;
        if (stripe) {
          stripe.redirectToCheckout({ sessionId });
        } else {
          console.error('Stripe.js failed to load.');
        }
      } catch (error) {
        console.error('Error creating checkout session:', error);
      }
    };

    onMounted(() => {
      if (hasSelectedDates.value) {
        availableTimes.value = generateAvailableTimes();
      }
    });

    return {
      hasSelectedDates,
      formattedDate,
      availableTimes,
      courts,
      selectTime,
      isSelected,
      isCourtDisabled,
      goToNextStep,
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

html, body {
  width: 100%;
  height: 100%;
  font-family: 'Montserrat', sans-serif;
}

.select-time-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #4300a2, #ff5858);
  color: white;
  padding: 40px 20px;
}

.main-content {
  background: white;
  color: #333;
  width: 100%;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 1350px;
}

.court {
  margin-top: 20px;
}

.court.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.times {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(.disabled) {
  background-color: #f857a6;
}

button.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:not(.disabled) {
  background-color: #ff5858;
  color: white;
}

button.selected {
  background-color: #007BFF;
  color: white;
}

.description {
  margin-top: 20px;
  color: #666;
}

.next-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.next-button:hover {
  background-color: #0056b3;
}
</style>
