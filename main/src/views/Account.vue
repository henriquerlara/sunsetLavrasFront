<template>
  <div class="account">
    <HomeIcon/>
    <div class="container">
      <div class="header">
        <h2>Minha Conta</h2>
      </div>
      <div v-if="loading">
        <div class="loader"></div>
        <p>Carregando dados do usuário...</p>
      </div>
      <div v-else-if="user">
        <div class="user-info">
          <p><strong>Nome:</strong> <input v-model="user.nome" /></p>
          <p><strong>Email:</strong> <input v-model="user.email" /></p>
          <p><strong>Senha:</strong> <input v-model="user.senha" /></p>
        </div>
        <div class="button-group">
          <button @click="updateUser" class="update-button">Atualizar</button>
          <button @click="logout" class="logout-button">Logout</button>
        </div>
        <button @click="toggleHorarios" class="horarios-button">
          {{ showHorarios ? 'Ocultar Horários' : 'Meus Horários' }}
        </button>
        <transition name="slide-fade">
          <div v-show="showHorarios" class="horarios-section">
            <h3>MEUS HORÁRIOS</h3>
            <div v-if="loadingHorarios">
              <div class="loader"></div>
              <p>Carregando horários...</p>
            </div>
            <div v-else>
              <div v-if="horarios.length > 0">
                <div v-for="horario in horarios" :key="horario.id" class="horario">
                  <p><strong>Data:</strong> {{ formatDate(horario.data) }}</p>
                  <p><strong>Hora:</strong> {{ horario.horario }}</p>
                  <p><strong>Quadra:</strong> {{ horario.quadra.nome }}</p>
                </div>
              </div>
              <div v-else>
                <p>Não há nenhum horário.</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import HomeIcon from '../components/HomeIcon.vue';
import dayjs from 'dayjs';

interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

interface Horario {
  id: number;
  data: string;
  horario: string;
  quadra: {
    nome: string;
  };
}

export default defineComponent({
  name: 'Account',
  components: {
    HomeIcon
  },
  setup() {
    const user = ref<User | null>(null);
    const horarios = ref<Horario[]>([]);
    const showHorarios = ref(false);
    const loading = ref(true);
    const loadingHorarios = ref(false);

    const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/account', { withCredentials: true });
          if (response.data && response.data.user) {
            user.value = response.data.user;
          }
        } catch (error) {
          console.error('Erro ao obter dados do usuário:', error);
        } finally {
          loading.value = false;
        }
    };

    const fetchHorarios = async () => {
      loadingHorarios.value = true;
      try {
        if (user.value) {
          const response = await axios.get(`http://localhost:3000/horariosOcupados/${user.value.id}`, { withCredentials: true });
          const allHorarios = response.data || [];
          const startOfToday = dayjs().startOf('day');
          horarios.value = allHorarios.filter((horario: Horario) => dayjs(horario.data).isAfter(startOfToday) || dayjs(horario.data).isSame(startOfToday));
        }
      } catch (error) {
        console.error('Erro ao obter reservas do usuário:', error);
      } finally {
        loadingHorarios.value = false;
      }
    };

    const toggleHorarios = () => {
      if (!showHorarios.value) {
        fetchHorarios();
      }
      showHorarios.value = !showHorarios.value;
    };

    const updateUser = async () => {
      try {
        await axios.put('http://localhost:3000/account', user.value, { withCredentials: true });
        alert('Dados atualizados com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
      }
    };

    const logout = async () => {
      try {
        await axios.post('http://localhost:3000/users/logout', {}, { withCredentials: true });
        user.value = null;
        window.location.href = '/';
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    };

    const formatDate = (date: string) => {
      return dayjs(date).format('DD/MM/YYYY');
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      user,
      horarios,
      showHorarios,
      toggleHorarios,
      updateUser,
      logout,
      loading,
      loadingHorarios,
      formatDate,
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
  position: relative;
}

.home-link {
  color: white;
  font-size: 2rem;
  text-decoration: none;
  position: absolute;
  top: 20px;
  left: 20px;
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
.logout-button,
.horarios-button {
  background: linear-gradient(to right, #4300a2, #ff5858);
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
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
.logout-button:hover,
.horarios-button:hover {
  background: linear-gradient(to left, #4300a2, #ff5858);
}

.logout-button {
  background: linear-gradient(to right, #4300a2, #ff5858);
}

.logout-button:hover {
  background: linear-gradient(to left, #4300a2, #ff5858);
}

.horarios-section {
  margin-top: 20px;
  background: linear-gradient(to right, #4300a2, #ff5858);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  text-align: left;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
  color: white;
}

.horario {
  background: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  color: black;
}

.horario p {
  margin: 5px 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s, max-height 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
