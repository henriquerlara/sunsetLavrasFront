<template>
  <div class="Welcome-banner">
    <div class="image">
      <img src="@/assets/quadras.jpg" alt="Sunset Arena Lavras" />
    </div>
    <div class="content">
      <h1>CONHEÇA NOSSAS QUADRAS</h1>
      <p>Localizado no centro de Lavras, Minas Gerais, a Sunset Arena conta com 5 quadras de areia para esportes de praia. Agende uma aula ou garanta seu aluguel online e prepare-se para a diversão!</p>
      <button>CONHECER</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '@/assets/homeBanners.css'

export default defineComponent({
  name: 'QuadrasBanner'
});
</script>

<style scoped>
.Welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background-color: #f8f8f8;
  flex-wrap: wrap;
}

.content {
  flex: 1;
  padding: 2rem;
  text-align: center;
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
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

button:hover {
  background-color: #ff5858;
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
