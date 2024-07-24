<template>
    <div class="cancel-page">
      <h1>Pagamento Cancelado</h1>
      <p>Seu pagamento foi cancelado. Se você tiver alguma dúvida, entre em contato com o suporte.</p>
      <router-link to="/">Voltar à página inicial</router-link>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'CancelPage',
  });
  </script>
  
  <style scoped>
  .cancel-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(to right, #4300a2, #ff5858);
    color: #ffffff;
    padding: 20px;
    text-align: center;
  }
  
  .cancel-page h1 {
    font-size: 2em;
    margin-bottom: 20px;
  }
  
  .cancel-page p {
    margin-bottom: 20px;
  }
  
  .cancel-page a {
    color: #ffffff;
    text-decoration: none;
    font-weight: bold;
  }
  </style>
  