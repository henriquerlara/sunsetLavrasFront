<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Cadastro</h1>
      <form @submit.prevent="registerUser">
        <div class="form-group">
          <label for="name">Nome</label>
          <input type="text" id="name" v-model="name" required pattern="[A-Za-z\s]{2,}" title="O nome deve ter pelo menos 2 caracteres e conter apenas letras." />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Por favor, insira um email válido." />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" required minlength="8" title="A senha deve ter pelo menos 8 caracteres." />
        </div>
        <div class="form-group">
          <label for="cpf">CPF</label>
          <input type="text" id="cpf" v-model="cpf" required pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" title="O CPF deve estar no formato XXX.XXX.XXX-XX" />
        </div>
        <div class="form-group">
          <label for="phone">Telefone</label>
          <input type="tel" id="phone" v-model="phone" required pattern="\(\d{2}\) \d{4,5}-\d{4}" title="O telefone deve estar no formato (XX) XXXXX-XXXX." />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      <p>Já tem uma conta? <router-link to="/login">Faça seu login</router-link></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      cpf: '',
      phone: '',
    };
  },
  methods: {
    async registerUser() {
      try {
        console.log('Registrando usuário com os dados:', {
          name: this.name,
          email: this.email,
          password: this.password,
          cpf: this.cpf,
          phone: this.phone,
        });

        const response = await axios.post('http://localhost:3000/api/users', {
          name: this.name,
          email: this.email,
          password: this.password,
          cpf: this.cpf,
          phone: this.phone,
        });

        alert('Cadastro realizado com sucesso!');
        console.log('Resposta da API:', response.data);
        this.$router.push('/login');
      } catch (error) {
        console.error('Erro ao realizar cadastro:', error);
        alert('Erro ao realizar cadastro. Por favor, tente novamente.');
      }
    },
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

html, body {
  width: 100%;
  height: 100%;
  font-family: 'Montserrat', sans-serif;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #4300a2, #ff5858);
}

.register-box {
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
  margin-bottom: 1.5rem;
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
  padding: 0.75rem 1rem;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 1.5rem;
}

button:hover {
  background-color: #ff5858;
}

p {
  margin-top: 1.5rem;
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
