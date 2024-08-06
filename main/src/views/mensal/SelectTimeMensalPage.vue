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
          <h1 class="title">Selecione os horários do seu plano</h1>
          <div class="main-content">
            <p class="subtitle"><strong>Os dias do plano serão:</strong> {{ formattedDates }}</p>
            <p class="subtitle"><strong>Dia da semana escolhido: </strong> {{ selectedDayName }}</p>
            <h2 class="horariosDisponiveis"><strong>Horários disponíveis:</strong></h2>
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
            <div class="descriptions">
            <p class="description">
              É possível selecionar mais de um horário de uma vez, mas todos os horários devem ser para a mesma quadra.
            </p>
            <p class="description">
              Cada horário selecionado corresponde a marcação para os quatro dias com desconto aplicado.
            </p>
          </div>
            <div class="total-price">
              Valor total: R$ {{ totalPrice.toFixed(2) }}
            </div>
          
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
          <WarningData :rota="rota" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import axios from 'axios';
import HomeIcon from '../../components/HomeIcon.vue';
import WarningData from '../../components/WarningData.vue';
import { loadStripe } from '@stripe/stripe-js';

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
  name: 'SelectTimeMensalPage',
  components: {
    HomeIcon,
    WarningData
  },
  setup() {
    const BASE_PRICE_PER_HOUR = 80; // Base price per hour
    const PRICE_DISCOUNTED_PER_HOUR = 75; // Discounted price per hour for the plan

    const store = useStore();
    const router = useRouter();
    const rota = ref("dias");
    const courts = ref<Court[]>([]);
    const availableTimes = ref<{ [courtId: number]: AvailableTime[] }>({});
    const selectedTimes = ref<{ court: number; hour: string }[]>([]);
    const activeCourt = ref<number | null>(null);
    const loading = ref(true);
    const nextButtonClicked = ref(false);
    const showWarning = ref(false);
    const errorMessage = ref<string | null>(null);
    const activePlanName = ref<string | null>('Mensal'); // Assuming 'Mensal' for the discount example

    const hasSelectedDates = computed(() => store.state.selectedDates && store.state.selectedDates.length > 0);
    const formattedDates = computed(() => store.state.selectedDates.map((date: string) => dayjs(date).format('DD/MM/YYYY')).join(', '));
    const selectedDayName = computed(() => {
      const selectedDayIndex = store.state.selectedDayIndex;
      const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return daysOfWeek[selectedDayIndex]; // Ajuste de acordo com o cálculo do Vue
    });

    const fetchCourts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/quadras');
        courts.value = response.data;
      } catch (error) {
        console.error('Error fetching courts:', error);
      }
    };

    const fetchOccupiedTimes = async (dates: string[], courtId: number) => {
      try {
        const response = await axios.post('http://localhost:3000/checkAvailability', {
          dates,
        });
        return response.data.unavailableTimes[courtId] || [];
      } catch (error) {
        console.error('Error fetching occupied times:', error);
        return [];
      }
    };

    const generateAvailableTimes = async () => {
      const times = [];
      const now = dayjs();

      for (let hour = 7; hour <= 21; hour++) {
        const time = dayjs().hour(hour).minute(0).second(0);
        const isAvailable = true; // All future times are considered available

        times.push({
          hour: time.format('HH:mm'),
          available: isAvailable,
        });
      }

      for (const court of courts.value) {
        const occupiedTimes = await fetchOccupiedTimes(store.state.selectedDates, court.id);
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
        activeCourt.value = court; // Set the active court when a time is selected
      } else {
        selectedTimes.value.splice(index, 1);
        if (selectedTimes.value.length === 0) {
          activeCourt.value = null; // Reset active court if no selections are made
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
      const selectedCourts = selectedTimes.value.map(t => t.court);

      try {
        const response = await axios.post('http://localhost:3000/stripe/create-checkout-session', {
          dates: store.state.selectedDates,
          entries: selectedTimes.value, // Pass court and hour pairs
          total: totalPrice.value,
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
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      if (hasSelectedDates.value) {
        await fetchCourts();
        await generateAvailableTimes();
      }
      loading.value = false; // Ensure loading is set to false if no dates are selected
    });

    const totalPrice = computed(() => {
      return selectedTimes.value.length * PRICE_DISCOUNTED_PER_HOUR * 4; // Total price for 4 occurrences
    });

    const discountApplied = computed(() => {
      return activePlanName.value !== null;
    });

    return {
      hasSelectedDates,
      formattedDates,
      selectedDayName,
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
      totalPrice, // Add the computed property to the return object
      discountApplied, // Add computed property for discount
      activePlanName,
    };
  },
});
</script>

<style scoped>

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
  border-top: 5px solid #888888;
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

.title{
  text-transform: uppercase;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.subtitle{
  font-size: 20px;
}

.court {
  margin-top: 10px;
  padding: 15px;
  background-color: #f7f7f7; /* Light background for courts section */
  border-radius: 8px;
}

.horariosDisponiveis{
  margin-top:10px;
  margin-bottom: -10px;
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
  color: #666;
}

.descriptions {
  margin-top: 20px;
}

.total-price {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
  color: #333;
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
  background-color: #007bff;
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
