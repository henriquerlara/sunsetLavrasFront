<template>
    <div class="banner">
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
  import '@/assets/homeBanners.css';
  
  export default defineComponent({
    name: 'PlanosBanner'
  });
  </script>
  
  <style scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: linear-gradient(to right, #4300a2, #ff5858);
  flex-wrap: wrap;
}

.content {
  flex: 1;
  padding: 2rem;
  text-align: center;
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
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}
  </style>
  