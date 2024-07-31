<template>
    <div class="planos-banner">
      <div class="image">
        <img src="@/assets/quadras.jpg" alt="Planos Sunset Arena Lavras" />
      </div>
      <div class="content">
        <h1>ESCOLHA SEU PLANO</h1>
        <p>Conheça os diferentes planos que oferecemos para aluguel de quadras. Temos opções que se encaixam perfeitamente no seu estilo de vida. Confira e escolha o melhor para você!</p>
        <router-link to="/planosView">
          <button>VER PLANOS</button>
        </router-link>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'PlanosBanner'
  });
  </script>
  
  <style scoped>
  
  .planos-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
    background: linear-gradient(to right, #4300a2, #ff5858);
  }
  
  .content {
    flex: 1;
    padding-left: 2rem;
  }
  
  h1 {
    font-size: 36px;
    color: #ffffff;
    margin-bottom: 1rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  p {
    font-size: 18px;
    color: #ffffff;
    margin-bottom: 2rem;
    font-weight: 400;
  }
  
  button {
    background-color: white;
    color: #f857a6;
    border: none;
    padding: 16px 32px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  .image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .image img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }
  </style>
  