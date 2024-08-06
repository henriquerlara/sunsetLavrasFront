<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <h1>Redefinir Senha</h1>
      <form @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <button type="submit">Enviar Link de Redefinição</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'ForgotPassword',
  setup() {
    const email = ref('');

    const handleForgotPassword = async () => {
      try {
        await axios.post('http://localhost:3000/request-password-reset', { email: email.value });
        alert('Email de redefinição de senha enviado. Verifique sua caixa de entrada.');
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          alert('Este email não está cadastrado no sistema.');
        } else {
          alert('Erro ao enviar e-mail de redefinição de senha.');
        }
        console.error(error);
      }
    };

    return { email, handleForgotPassword };
  },
});
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #4300a2, #ff5858);
}

.forgot-password-box {
  background: white;
  padding: 60px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 400px;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 28px;
  color: #f857a6;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

button {
  background-color: #f857a6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 1rem;
}

button:hover {
  background-color: #ff5858;
}
</style>
