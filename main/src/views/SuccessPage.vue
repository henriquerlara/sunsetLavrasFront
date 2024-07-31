<template>
    <div class="success-page">
      <h1>Pagamento realizado com sucesso!</h1>
      <p>Sua reserva foi confirmada.</p>
      <button @click="goToHome">Voltar para a Home</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'SuccessPage',
    setup() {
      const router = useRouter();
  
      const goToHome = () => {
        router.push('/');
      };
  
      return {
        goToHome,
      };
    },
  });
  </script>
  
  <style scoped>
  .success-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(to right, #4300a2, #ff5858);
    color: white;
    text-align: center;
  }
  
  button {
    padding: 10px 20px;
    background-color: white;
    color: #ff5858;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #f857a6;
  }
  </style>
  