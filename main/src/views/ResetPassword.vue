<template>
  <div class="reset-password-container">
    <div v-if="!tokenExpired">
      <form @submit.prevent="resetPassword">
        <div class="form-group">
          <label for="newPassword">Nova Senha</label>
          <input type="password" id="newPassword" v-model="newPassword" required />
        </div>
        <button type="submit">Redefinir Senha</button>
      </form>
    </div>
    <div v-else class="token-expired">
      <p>O token expirou. Por favor, solicite uma nova redefinição de senha.</p>
      <router-link to="/login">Voltar para o login</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import jwtDecode from 'jwt-decode';

export default defineComponent({
  name: 'ResetPassword',
  setup() {
    const newPassword = ref('');
    const tokenExpired = ref(false);
    const token = ref('');
    const router = useRouter();

    const resetPassword = async () => {
      try {
        await axios.post('http://localhost:3000/reset-password', {
          token: token.value,
          newPassword: newPassword.value,
        });
        alert('Senha redefinida com sucesso!');
        router.push('/login'); // Changed from '/register' to '/login'
      } catch (error) {
        console.error('Erro ao redefinir a senha:', error);
        alert('Erro ao redefinir a senha. Por favor, tente novamente.');
      }
    };

    const verifyToken = () => {
      const urlParams = new URLSearchParams(window.location.search);
      token.value = urlParams.get('token') || '';

      if (!token.value) {
        tokenExpired.value = true;
        return;
      }

      try {
        const decoded: { exp: number } = jwtDecode(token.value);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          tokenExpired.value = true;
        }
      } catch (error) {
        console.error('Token inválido:', error);
        tokenExpired.value = true;
      }
    };

    onMounted(() => {
      verifyToken();
    });

    return {
      newPassword,
      resetPassword,
      tokenExpired,
    };
  },
});
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #4300a2, #ff5858);
  color: white;
  padding: 40px 20px;
}

form {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
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

.token-expired {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: #333;
}

.token-expired p {
  margin-bottom: 1.5rem;
  font-size: 18px;
}

.router-link {
  color: #f857a6;
  text-decoration: none;
}

.router-link:hover {
  text-decoration: underline;
}
</style>
