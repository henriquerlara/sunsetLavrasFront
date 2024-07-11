<template>
  <div class="Welcome-banner">
    <div class="content">
      <h1>CONHEÇA A SUNSET ARENA LAVRAS</h1>
      <p>Localizado no centro de Lavras, Minas Gerais, a Sunset Arena conta com 5 quadras de areia para esportes de praia. Agende uma aula ou garanta seu aluguel online e prepare-se para a diversão!</p>
      <button>AGENDAR</button>
    </div>
    <div class="image">
      <img src="@/assets/quadras.jpg" alt="Sunset Arena Lavras" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WelcomeBanner'
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

.Welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  font-family: 'Montserrat', sans-serif;
  background-color: #f8f8f8; /* Cor de fundo leve */
}

.content {
  flex: 1;
  padding-right: 2rem;
}

h1 {
  font-size: 36px;
  color: #f857a6;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

p {
  font-size: 18px;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 400;
}

button {
  background-color: #f857a6;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

button:hover {
  background-color: #ff5858;
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
