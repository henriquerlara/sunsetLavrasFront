<template>
    <div class="register-container">
      <div class="register-box">
        <h1>Cadastro</h1>
        <form @submit.prevent="registerUser">
          <div class="form-group">
            <label for="name">Nome</label>
            <input type="text" id="name" v-model="name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" id="password" v-model="password" required />
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
        password: ''
      };
    },
    methods: {
      async registerUser() {
        try {
          console.log('Registrando usuário com os dados:', {
            name: this.name,
            email: this.email,
            password: this.password
          });
  
          const response = await axios.post('http://localhost:3000/api/users', {
            name: this.name,
            email: this.email,
            password: this.password
          });
  
          alert('Cadastro realizado com sucesso!');
          console.log('Resposta da API:', response.data);
        } catch (error) {
          console.error('Erro ao realizar cadastro:');
          alert('Erro ao realizar cadastro. Por favor, tente novamente.');
        }
      }
    }
  });
  </script>
  
  <style scoped>
  
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f8f8;
  }
  
  .register-box {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 300px;
  }
  
  h1 {
    margin-bottom: 1rem;
    font-size: 24px;
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
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
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
  