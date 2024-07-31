<template>
  <div class="select-time-page">
    <HomeIcon />
    <div class="container">
      <div v-if="loading">
        <div class="loader"></div>
        <p>Carregando dados...</p>
      </div>
      <div v-else>
        <div v-if="hasSelectedDates">
          <h1>Selecione um horário para {{ formattedDate }}</h1>
          <div class="main-content">
            <h2>Horários disponíveis:</h2>
            <div v-for="court in courts" :key="court.id" :class="{ disabled: isCourtDisabled(court.id) }" class="court">
              <h3>{{ court.nome }} - {{ court.patrocinador.nome }}</h3>
              <div class="times">
                <button
                  v-for="time in availableTimes[court.id]"
                  :key="time.hour"
                  :class="{ disabled: !time.available || isCourtDisabled(court.id), selected: isSelected(court.id, time.hour) }"
                  @click="selectTime(court.id, time.hour)"
                  :disabled="!time.available || isCourtDisabled(court.id)"
                >
                  {{ time.hour }}
                </button>
              </div>
            </div>
            <p class="description">
              É possível selecionar mais de um horário de uma vez, mas todos os horários devem ser para a mesma quadra.
            </p>
            <button
              class="next-button"
              :class="{ clicked: nextButtonClicked }"
              @click="goToNextStep"
              @mousedown="nextButtonClicked = true"
              @mouseup="nextButtonClicked = false"
            >
              Próximo
            </button>
            <p v-if="showWarning" class="warning">Por favor, selecione um horário antes de prosseguir.</p>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          </div>
        </div>
        <div v-else>
          <WarningData :rota="rota"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import { loadStripe } from '@stripe/stripe-js';
import HomeIcon from '../../components/HomeIcon.vue';
import WarningData from '../../components/WarningData.vue';
import axios, { AxiosError } from 'axios';

const stripePromise = loadStripe('pk_test_51PfufkRxlLJdQ9IhESSmTptbyyFlrIbQbBA8KComvvRgFSxKt9IUh9DmqkBIOOgx0rDGweY00GDohnCL1id9KfDH00Xgsu33QH');

interface AvailableTime {
  hour: string;
  available: boolean;
}

interface Court {
  id: number;
  nome: string;
  patrocinador: {
    nome: string;
  };
}

export default defineComponent({
  name: 'SelectTimePage',
  components: {
    HomeIcon,
    WarningData
  },
  setup() {
    const rota = ref<string>("calendar");
    const store = useStore();
    const router = useRouter();
    const courts = ref<Court[]>([]);
    const availableTimes = ref<{ [courtId: number]: AvailableTime[] }>({});
    const selectedTimes = ref<{ court: number; hour: string }[]>([]);
    const activeCourt = ref<number | null>(null);
    const loading = ref(true);
    const nextButtonClicked = ref(false);
    const showWarning = ref(false);
    const errorMessage = ref<string | null>(null);

    const hasSelectedDates = computed(() => store.state.selectedDate != null);
    const selectedDate = computed(() => dayjs(store.state.selectedDate));
    const formattedDate = computed(() => selectedDate.value.format('DD/MM/YYYY'));
    const usuario = computed(() => store.state.usuario); // Get usuario from Vuex store

    const fetchCourts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/quadras');
        courts.value = response.data;
      } catch (error) {
        console.error('Error fetching courts:', error);
      }
    };

    const fetchOccupiedTimes = async (date: string, courtId: number) => {
      try {
        const response = await axios.get(`http://localhost:3000/horariosOcupados/${date}/${courtId}`);
        return response.data as string[];
      } catch (error) {
        console.error('Error fetching occupied times:', error);
        return [];
      }
    };

    const generateAvailableTimes = async () => {
      const times: AvailableTime[] = [];
      const now = dayjs();

      for (let hour = 7; hour <= 21; hour++) {
        const time = selectedDate.value.hour(hour).minute(0).second(0);
        const isAvailable = selectedDate.value.isAfter(now, 'day') || time.isAfter(now);

        times.push({
          hour: time.format('HH:mm'),
          available: isAvailable,
        });
      }

      for (const court of courts.value) {
        const occupiedTimes = await fetchOccupiedTimes(selectedDate.value.format('YYYY-MM-DD'), court.id);
        const courtTimes = times.map(time => ({
          ...time,
          available: time.available && !occupiedTimes.includes(time.hour),
        }));
        availableTimes.value[court.id] = courtTimes;
      }

      loading.value = false;
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
  if (selectedTimes.value.length === 0) {
    showWarning.value = true;
    setTimeout(() => {
      showWarning.value = false;
    }, 3000);
    return;
  }

  loading.value = true;
  const selectedHours = selectedTimes.value.map(t => t.hour);
  await store.dispatch('fetchUsuario');
  const userId = store.state.usuario?.id;

  console.log('User ID:', userId); // Log userId for debugging

  if (!userId) {
    errorMessage.value = 'User ID is missing';
    loading.value = false;
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/stripe/create-checkout-session', {
      date: selectedDate.value.format('YYYY-MM-DD'),
      hours: selectedHours,
      court: selectedTimes.value[0].court,
      userId, // Make sure userId is included
    });

    const sessionId = response.data.id;

    // Redirect to Stripe checkout page
    const stripe = await stripePromise;
    if (stripe) {
      stripe.redirectToCheckout({ sessionId });
    } else {
      console.error('Stripe.js failed to load.');
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.data && (axiosError.response.data as any).error) {
      errorMessage.value = (axiosError.response.data as any).error;
      router.push('/cancel'); // Redirect to cancel page
    } else {
      console.error('Error creating checkout session:', axiosError);
    }
  } finally {
    loading.value = false;
  }
};


    onMounted(async () => {
      // Fetch user data when the component mounts
      await store.dispatch('fetchUsuario');

      console.log('Fetched usuario:', store.state.usuario); // Log fetched user data for debugging

      if (hasSelectedDates.value) {
        await fetchCourts();
        await generateAvailableTimes();
      }
      loading.value = false; // Ensure loading is set to false if no dates are selected
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
      loading,
      nextButtonClicked,
      showWarning,
      rota,
      errorMessage,
    };
  },
});
</script>

<style scoped>
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
  background-color: #4300a2;
  color: white;
}

button.selected:hover {
  background-color: #6600f5;
}

.description {
  margin-top: 20px;
  color: #666;
}

.next-button {
  background: linear-gradient(to right, #4300a2, #ff5858);
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
  margin-top: 20px;
}

.next-button.clicked {
  background-color: #007BFF;
  color: white;
}

.next-button.clicked:hover {
  background-color: #0056b3;
}

.next-button:hover {
  background: linear-gradient(to right, #ff5858, #4300a2);
}

.back-button {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: white;
  color: #ff5858;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin: auto;
}

.warning {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
