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
          <h1 class="title">Selecione um horário para {{ formattedDate }}</h1>
          <div class="main-content">
            <h2>Horários disponíveis:</h2>
            <div v-for="court in courts" :key="court.id" class="court">
              <h3>{{ court.nome }} - {{ court.patrocinador.nome }}</h3>
              <div class="times">
                <button
                  v-for="time in availableTimes[court.id]"
                  :key="time.hour"
                  :class="{
                    disabled: !time.available,
                    selected: isSelected(court.id, time.hour),
                  }"
                  @click="selectTime(court.id, time.hour)"
                  :disabled="!time.available"
                >
                  {{ time.hour }}
                </button>
              </div>
            </div>
            <p class="description">
              É possível selecionar mais de um horário de uma vez, em diferentes quadras.
            </p>
            <div class="total-price">
              Valor total: R$ {{ totalPrice.toFixed(2) }}
            </div>
            <p v-if="discountApplied" class="discount-message">
              Desconto aplicado por ter plano: {{ activePlanName }}
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
            <p v-if="showWarning" class="warning">
              Por favor, selecione um horário antes de prosseguir.
            </p>
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
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import dayjs from "dayjs";
import { loadStripe } from "@stripe/stripe-js";
import HomeIcon from "../../components/HomeIcon.vue";
import WarningData from "../../components/WarningData.vue";
import axios, { AxiosError } from "axios";

const stripePromise = loadStripe(
  "pk_test_51PfufkRxlLJdQ9IhESSmTptbyyFlrIbQbBA8KComvvRgFSxKt9IUh9DmqkBIOOgx0rDGweY00GDohnCL1id9KfDH00Xgsu33QH"
);

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
  name: "SelectTimePage",
  components: {
    HomeIcon,
    WarningData,
  },
  setup() {
    const BASE_PRICE_PER_HOUR = 80; // Base price per hour
    const PRICE_DISCOUNTS = {
      mensal: 75,
      trimestral: 65,
    };

    const rota = ref<string>("calendar");
    const store = useStore();
    const router = useRouter();
    const courts = ref<Court[]>([]);
    const availableTimes = ref<{ [courtId: number]: AvailableTime[] }>({});
    const selectedTimes = ref<{ court: number; hour: string }[]>([]);
    const loading = ref(true);
    const nextButtonClicked = ref(false);
    const showWarning = ref(false);
    const errorMessage = ref<string | null>(null);
    const activePlanName = ref<string | null>(null);

    const hasSelectedDates = computed(() => store.state.selectedDate != null);
    const selectedDate = computed(() => dayjs(store.state.selectedDate));
    const formattedDate = computed(() =>
      selectedDate.value.format("DD/MM/YYYY")
    );
    const usuario = computed(() => store.state.usuario); // Get usuario from Vuex store

    const fetchCourts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/quadras");
        courts.value = response.data;
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    };

    const fetchOccupiedTimes = async (date: string, courtId: number) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/horariosOcupados/${date}/${courtId}`
        );
        return response.data as string[];
      } catch (error) {
        console.error("Error fetching occupied times:", error);
        return [];
      }
    };

    const generateAvailableTimes = async () => {
      const times: AvailableTime[] = [];
      const now = dayjs();

      for (let hour = 7; hour <= 21; hour++) {
        const time = selectedDate.value.hour(hour).minute(0).second(0);
        const isAvailable =
          selectedDate.value.isAfter(now, "day") || time.isAfter(now);

        times.push({
          hour: time.format("HH:mm"),
          available: isAvailable,
        });
      }

      for (const court of courts.value) {
        const occupiedTimes = await fetchOccupiedTimes(
          selectedDate.value.format("YYYY-MM-DD"),
          court.id
        );
        const courtTimes = times.map((time) => ({
          ...time,
          available: time.available && !occupiedTimes.includes(time.hour),
        }));
        availableTimes.value[court.id] = courtTimes;
      }

      loading.value = false;
    };

    const selectTime = (court: number, hour: string) => {
      const index = selectedTimes.value.findIndex(
        (t) => t.court === court && t.hour === hour
      );
      if (index === -1) {
        selectedTimes.value.push({ court, hour });
      } else {
        selectedTimes.value.splice(index, 1);
      }
    };

    const isSelected = (court: number, hour: string) => {
      return selectedTimes.value.some(
        (t) => t.court === court && t.hour === hour
      );
    };

    const fetchUserPlans = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/planosUsuario/${usuario.value?.id}`
        );
        const userPlans = response.data || [];
        // Check for active plans
        if (userPlans.some((plan: any) => plan.nome === "trimestral")) {
          activePlanName.value = "Trimestral";
        } else if (userPlans.some((plan: any) => plan.nome === "mensal")) {
          activePlanName.value = "Mensal";
        }
      } catch (error) {
        console.error("Erro ao obter planos do usuário:", error);
      }
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
  const selectedEntries = selectedTimes.value.map((t) => ({
    court: t.court,
    hour: t.hour,
  }));

  await store.dispatch("fetchUsuario");
  const userId = store.state.usuario?.id;

  if (!userId) {
    errorMessage.value = "User ID is missing";
    loading.value = false;
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/stripe/create-checkout-session",
      {
        date: selectedDate.value.format("YYYY-MM-DD"),
        entries: selectedEntries, // Enviar como pares de quadra e horário
        userId, // Certifique-se de que userId está incluído
      }
    );

    const sessionId = response.data.id;

    // Redirecionar para a página de pagamento do Stripe
    const stripe = await stripePromise;
    if (stripe) {
      stripe.redirectToCheckout({ sessionId });
    } else {
      console.error("Stripe.js failed to load.");
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (
      axiosError.response &&
      axiosError.response.data &&
      (axiosError.response.data as any).error
    ) {
      errorMessage.value = (axiosError.response.data as any).error;
      router.push("/cancel"); // Redirecionar para a página de cancelamento
    } else {
      console.error("Error creating checkout session:", axiosError);
    }
  } finally {
    loading.value = false;
  }
};

    onMounted(async () => {
      // Fetch user data when the component mounts
      await store.dispatch("fetchUsuario");

      console.log("Fetched usuario:", store.state.usuario); // Log fetched user data for debugging

      if (hasSelectedDates.value) {
        await fetchCourts();
        await generateAvailableTimes();
        await fetchUserPlans(); // Fetch user's active plans
      }
      loading.value = false; // Ensure loading is set to false if no dates are selected
    });

    const totalPrice = computed(() => {
      let pricePerHour = BASE_PRICE_PER_HOUR;

      if (activePlanName.value === "Trimestral") {
        pricePerHour = PRICE_DISCOUNTS.trimestral;
      } else if (activePlanName.value === "Mensal") {
        pricePerHour = PRICE_DISCOUNTS.mensal;
      }

      return selectedTimes.value.length * pricePerHour;
    });

    const discountApplied = computed(() => {
      return activePlanName.value !== null;
    });

    return {
      hasSelectedDates,
      formattedDate,
      availableTimes,
      courts,
      selectTime,
      isSelected,
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
html,
body {
  width: 100%;
  height: 100%;
  font-family: "Montserrat", sans-serif;
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
  border-top: 5px solid #cd7f32; 
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
  margin-top: 10px;
  padding: 15px;
  background-color: #f7f7f7; /* Light background for courts section */
  border-radius: 8px;
}

.title{
  text-transform: uppercase;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
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

.total-price {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
  color: #333;
}

.discount-message {
  font-size: 1rem;
  color: green;
  margin-top: 10px;
}

.next-button {
  background: linear-gradient(to right, #4300a2, #ff5858);
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
