<template>
    <div class="payment-page">
      <h1>Pagamento</h1>
      <div class="summary">
        <p><strong>Data:</strong> {{ date }}</p>
        <p><strong>Quadra:</strong> {{ court }}</p>
        <p><strong>Horários Selecionados:</strong> {{ hours.join(', ') }}</p>
        <p><strong>Total:</strong> R$ {{ total }}</p>
      </div>
      <button @click="processPayment">Pagar</button>
      <div v-if="paymentStatus" class="status">{{ paymentStatus }}</div>
    </div>
  </template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'PaymentPage',
  setup() {
    const route = useRoute();
    const date = ref(route.query.date as string);
    const hours = ref<string[]>(JSON.parse(route.query.hours as string));
    const court = ref(route.query.court as string);
    const total = ref<number>(hours.value.length * 80);
    const paymentStatus = ref<string | null>(null);

    const processPayment = async () => {
      try {
        const response = await axios.post('https://api.exemplo.com/pagamento', {
          date: date.value,
          hours: hours.value,
          court: court.value,
          total: total.value,
        });
        if (response.status === 200) {
          paymentStatus.value = 'Pagamento realizado com sucesso!';
        } else {
          paymentStatus.value = 'Falha no pagamento. Tente novamente.';
        }
      } catch (error) {
        paymentStatus.value = 'Erro ao processar o pagamento. Tente novamente.';
      }
    };

    return {
      date,
      hours,
      court,
      total,
      processPayment,
      paymentStatus,
    };
  },
});
</script>
<style scoped>
.payment-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #4300a2, #ff5858);
  color: white;
  padding: 40px 20px;
}

.summary {
  background: white;
  color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.status {
  margin-top: 20px;
}
</style>
  