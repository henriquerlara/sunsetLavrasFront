<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="senha">Senha</label>
          <input type="password" id="senha" v-model="senha" required />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem uma conta? <router-link to="/register">Faça seu cadastro</router-link></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref<string | null>(null);
    const senha = ref<string | null>(null);

    const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email: email.value,
          senha: senha.value
        }, { withCredentials: true });

        if (response.data.success) {
          store.commit('setAuthentication', true);
          router.push('/'); // Use o router aqui
        } else {
          alert('Login falhou. Por favor, verifique suas credenciais.');
        }
      } catch (error) {
        console.error('Erro ao realizar login:', error);
        alert('Erro ao realizar login. Por favor, tente novamente.');
      }
    };

    return {
      handleLogin,
      email,
      senha,
    };
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #4300a2, #ff5858);
}

.login-box {
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

p {
  margin-top: 1rem;
  font-size: 14px;
}

router-link {
  color: #f857a6;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
</style>
