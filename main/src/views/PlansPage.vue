<template>
    <div class="plans-page">
    <HomeIcon />
      <div class="container">
        <h1>ESCOLHA SEU PLANO</h1>
        <div class="plans">
          <div class="plan" @click="selectPlan('avulso')">
            <h2>Avulso</h2>
            <p>Sem plano. Pague por sessão.</p>
            <router-link :to="{ name: 'Calendar' }" class="button">Agendar</router-link>
          </div>
          <div class="plan" @click="selectPlan('mensal')">
            <h2>Mensal</h2>
            <p>Acesso ilimitado por um mês.</p>
            <router-link :to="{ name: 'SelectDayPage' }" class="button">Agendar</router-link>
          </div>
          <div class="plan" @click="selectPlan('trimestral')">
            <h2>Trimestral</h2>
            <p>Acesso ilimitado por três meses.</p>
            <router-link :to="{ name: 'Calendar' }" class="button">Agendar</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import HomeIcon from '../components/HomeIcon.vue'
  
  export default defineComponent({
    name: 'PlansPage',
    components: {
        HomeIcon
    },
    setup() {
      const selectPlan = (plan: string) => {
        // Você pode adicionar lógica aqui para salvar o plano selecionado
        console.log(`Plano selecionado: ${plan}`);
      };
  
      return {
        selectPlan,
      };
    },
  });
  </script>
  
  <style scoped>
  
  .plans-page {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(to right, #4300a2, #ff5858);
    color: white;
    padding: 40px 20px;
  }
  
  .container {
    text-align: center;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  
  .plans {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .plan {
    background: white;
    color: #333;
    padding-top: 50px;
    padding-bottom: 50px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 250px;
    cursor: pointer;
    transition: transform 0.3s;
  }
  
  .plan:hover {
    transform: scale(1.05);
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 1rem;
    margin-bottom: 20px;
  }
  
  .button {
    display: inline-block;
    padding: 10px 20px;
    background: linear-gradient(to right, #4300a2, #ff5858);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    transition: background 0.3s;
  }
  
  .button:hover {
    background:  linear-gradient(to left, #4300a2, #ff5858);
  }
  </style>
  