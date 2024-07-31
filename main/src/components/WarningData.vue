<template>
  <div class="noPlan">
    <p class="message">Você deve selecionar uma data primeiro.</p>
    <router-link :to="`/${rota}`" class="back-button">Voltar à seleção</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WarningData',
  props: {
    rota: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped>

.message {
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.back-button {
  padding: 10px 20px;
  background-color: white;
  color: #ff5858;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  font-weight: bold;
}

.back-button:hover {
  background-color: #ff5858;
  color: white;
}
</style>
