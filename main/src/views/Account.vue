<template>
    <div class="account">
      <router-link to="/" class="home-link">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </router-link>
      <div class="container">
        <div class="header">
          <h2>Minha Conta</h2>
        </div>
        <div v-if="user">
          <div class="user-info">
            <p><strong>Nome:</strong> <input v-model="user.name" /></p>
            <p><strong>Email:</strong> <input v-model="user.email" /></p>
            <p><strong>Senha:</strong> <input v-model="user.password" /></p>
          </div>
          <div class="button-group">
            <button @click="updateUser" class="update-button">Atualizar</button>
            <button @click="logout" class="logout-button">Logout</button>
          </div>
        </div>
        <div v-else>
          <p>Carregando dados do usuário...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from 'axios';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  
  interface User {
    name: string;
    email: string;
    password: string;
  }
  
  export default defineComponent({
    name: 'Account',
    components: {
      FontAwesomeIcon,
    },
    setup() {
      const user = ref<User | null>(null);
  
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/account', { withCredentials: true });
          if (response.data && response.data.user) {
            user.value = response.data.user;
          }
        } catch (error) {
          console.error('Erro ao obter dados do usuário:', error);
        }
      };
  
      const updateUser = async () => {
        try {
          await axios.put('http://localhost:3000/api/account', user.value, { withCredentials: true });
          alert('Dados atualizados com sucesso!');
        } catch (error) {
          console.error('Erro ao atualizar dados do usuário:', error);
        }
      };
  
      const logout = async () => {
        try {
          await axios.post('http://localhost:3000/api/logout', {}, { withCredentials: true });
          user.value = null;
          window.location.href = '/';
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        }
      };
  
      onMounted(() => {
        fetchUserData();
      });
  
      return {
        user,
        updateUser,
        logout,
      };
    },
  });
  </script>
  
  <style scoped>
  
  .account {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(to right, #4300a2, #ff5858);
    color: white;
    padding: 40px 20px;
    position: relative; /* Add this to position the home link */
  }
  
  .home-link {
    color: white;
    font-size: 2rem;
    text-decoration: none;
    position: absolute;
    top: 20px;
    left: 20px; /* Adjust position to top-left corner */
  }
  
  .container {
    background: white;
    color: #333;
    max-width: 600px;
    width: 100%;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  
  h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .user-info p {
    font-size: 1.2rem;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  input {
    width: calc(100% - 120px);
    padding: 10px;
    margin-top: 5px;
    font-size: 1.2rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  strong {
    color: #333;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
  }
  
  .update-button,
  .logout-button {
    background: linear-gradient(to right, #ff5858, #f857a6);
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    font-family: 'Montserrat', sans-serif; /* Fonte personalizada */
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s;
    margin: 10px 5px;
    flex: 1;
  }
  
  .update-button:hover,
  .logout-button:hover {
    background: linear-gradient(to right, #f857a6, #ff5858);
  }
  
  .logout-button {
    background: linear-gradient(to right, #f857a6, #ff5858);
  }
  
  .logout-button:hover {
    background: linear-gradient(to right, #ff5858, #f857a6);
  }
  </style>
  