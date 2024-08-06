<template>
  <div class="account">
    <HomeIcon />
    <div class="container">
      <div class="header">
        <h2>Minha Conta</h2>
        <font-awesome-icon
          :icon="isEditing ? 'times' : 'edit'"
          class="edit-icon"
          @click="toggleEdit"
          :class="{ active: isEditing }"
        />
      </div>
      <div v-if="loading">
        <div class="loader"></div>
        <p>Carregando dados do usuário...</p>
      </div>
      <div v-else-if="user">
        <div class="help-text">
          Clique no ícone <strong>{{ isEditing ? "X" : "editar" }}</strong> no canto superior direito para 
          {{ isEditing ? "sair do modo de edição" : "entrar no modo de edição" }}.
        </div>
        <div class="user-info">
          <p>
            <strong>Nome:</strong>
            <input :readonly="!isEditing" v-model="user.nome" />
            <span class="error" v-if="errors.nome">{{ errors.nome }}</span>
          </p>
          <p>
            <strong>Email:</strong>
            <input :readonly="!isEditing" v-model="user.email" />
            <span class="error" v-if="errors.email">{{ errors.email }}</span>
          </p>
          <p>
            <strong>CPF:</strong>
            <input :readonly="!isEditing" v-model="user.cpf" @input="applyCpfMask" />
            <span class="error" v-if="errors.cpf">{{ errors.cpf }}</span>
          </p>
          <p>
            <strong>Telefone:</strong>
            <input :readonly="!isEditing" v-model="user.telefone" @input="applyPhoneMask" />
            <span class="error" v-if="errors.telefone">{{ errors.telefone }}</span>
          </p>
        </div>
        <div class="button-group">
          <button v-if="isEditing" @click="saveUser" class="save-button" :disabled="saving">
            <span v-if="saving">Salvando...</span>
            <span v-else>Salvar</span>
          </button>
          <button v-else @click="logout" class="logout-button">Logout</button>
        </div>
        <div class="extra-buttons" v-if="!isEditing">
          <button @click="toggleHorarios" class="horarios-button">
            {{ showHorarios ? "Ocultar Horários" : "Meus Horários" }}
          </button>
          <button @click="togglePlanos" class="planos-button">
            {{ showPlanos ? "Ocultar Planos" : "Meus Planos" }}
          </button>
        </div>
        <transition name="slide-fade">
          <div v-show="showHorarios && !isEditing" class="horarios-section">
            <h3>MEUS HORÁRIOS</h3>
            <div v-if="loadingHorarios">
              <div class="loader"></div>
              <p>Carregando horários...</p>
            </div>
            <div v-else>
              <div v-if="horarios.length > 0">
                <div
                  v-for="horario in horarios"
                  :key="horario.id"
                  class="horario"
                >
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
        <transition name="slide-fade">
          <div v-show="showPlanos && !isEditing" class="planos-section">
            <h3>MEUS PLANOS</h3>
            <div v-if="loadingPlanos">
              <div class="loader"></div>
              <p>Carregando planos...</p>
            </div>
            <div v-else>
              <div v-if="planos.length > 0">
                <div v-for="plano in planos" :key="plano.id" class="plano">
                  <p><strong>Plano:</strong> {{ plano.nome }}</p>
                  <p><strong>Início:</strong> {{ formatDate(plano.inicio) }}</p>
                  <p><strong>Fim:</strong> {{ formatDate(plano.fim) }}</p>
                </div>
              </div>
              <div v-else>
                <p>Não há planos ativos.</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import HomeIcon from "../components/HomeIcon.vue";
import dayjs from "dayjs";
import * as yup from "yup";
import { validateCPF } from "../services/validateCPF";

interface User {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

interface Horario {
  id: number;
  data: string;
  horario: string;
  quadra: {
    nome: string;
  };
}

interface Plano {
  id: number;
  nome: string;
  inicio: string;
  fim: string;
}

export default defineComponent({
  name: "Account",
  components: {
    HomeIcon,
  },
  setup() {
    const user = ref<User | null>(null);
    const horarios = ref<Horario[]>([]);
    const planos = ref<Plano[]>([]);
    const showHorarios = ref(false);
    const showPlanos = ref(false);
    const loading = ref(true);
    const loadingHorarios = ref(true);
    const loadingPlanos = ref(true);
    const isEditing = ref(false);
    const saving = ref(false);
    const errors = ref<Record<string, string>>({});

    const schema = yup.object().shape({
      nome: yup
        .string()
        .min(2, "O nome deve ter pelo menos 2 caracteres")
        .required("Nome é obrigatório"),
      email: yup
        .string()
        .email("Email inválido")
        .required("Email é obrigatório"),
      cpf: yup
        .string()
        .required('CPF é obrigatório')
        .test('is-valid-cpf', 'CPF inválido', (value) => {
          const cleanCpf = value?.replace(/\D/g, '');
          if (!cleanCpf || cleanCpf.length < 11) {
            return false; // Se o CPF não tiver 11 dígitos, é considerado inválido
          }
          return validateCPF(cleanCpf);
        }),
      telefone: yup
        .string()
        .matches(
          /^\(\d{2}\) \d{4,5}-\d{4}$/,
          "O telefone deve estar no formato (XX) XXXXX-XXXX"
        )
        .required("Telefone é obrigatório"),
    });

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/account", {
          withCredentials: true,
        });
        if (response.data && response.data.user) {
          user.value = response.data.user;
        }
      } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchHorarios = async () => {
  loadingHorarios.value = true;
  try {
    if (user.value) {
      const response = await axios.get(
        `http://localhost:3000/horariosOcupados/${user.value.id}`,
        { withCredentials: true }
      );
      const allHorarios = response.data || [];
      const startOfToday = dayjs().startOf("day");
      
      // Ordenando os horários por data e hora
      horarios.value = allHorarios
        .filter(
          (horario: Horario) =>
            dayjs(horario.data).isAfter(startOfToday) ||
            dayjs(horario.data).isSame(startOfToday)
        )
        .sort((a: Horario, b: Horario) => {
          const dateA = dayjs(`${a.data} ${a.horario}`);
          const dateB = dayjs(`${b.data} ${b.horario}`);
          return dateA.isBefore(dateB) ? -1 : 1;
        });
    }
  } catch (error) {
    console.error("Erro ao obter reservas do usuário:", error);
  } finally {
    loadingHorarios.value = false;
  }
};

    const fetchPlanos = async () => {
      try {
        if (user.value) {
          const response = await axios.get(
            `http://localhost:3000/reservas/${user.value.id}`,
            { withCredentials: true }
          );
          planos.value = response.data || [];
          loadingPlanos.value = false
        }
      } catch (error) {
        console.error("Erro ao obter planos do usuário:", error);
      }
    };

    const toggleHorarios = () => {
      if (!showHorarios.value) {
        fetchHorarios();
      }
      showHorarios.value = !showHorarios.value;
    };

    const togglePlanos = () => {
      if (!showPlanos.value) {
        fetchPlanos();
      }
      showPlanos.value = !showPlanos.value;
    };

    const toggleEdit = () => {
      isEditing.value = !isEditing.value;
      if (!isEditing.value) {
        errors.value = {};
      } else {
        // Esconde os horários e planos quando entra em modo de edição
        showHorarios.value = false;
        showPlanos.value = false;
      }
    };

    const saveUser = async () => {
      errors.value = {};
      try {
        await schema.validate(user.value, { abortEarly: false });
        saving.value = true;
        await axios.put("http://localhost:3000/account", user.value, {
          withCredentials: true,
        });
        alert("Dados atualizados com sucesso!");
        isEditing.value = false; // Sai do modo de edição
      } catch (validationError) {
        if (validationError instanceof yup.ValidationError) {
          validationError.inner.forEach((err) => {
            if (err.path) {
              errors.value[err.path] = err.message;
            }
          });
        } else {
          console.error("Erro ao atualizar dados do usuário:", validationError);
        }
      } finally {
        saving.value = false;
      }
    };

    const applyCpfMask = (event: Event) => {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      const cpfParts = value.match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
      if (cpfParts) {
        input.value = !cpfParts[2] ? cpfParts[1] : `${cpfParts[1]}.${cpfParts[2]}${cpfParts[3] ? '.' + cpfParts[3] : ''}${cpfParts[4] ? '-' + cpfParts[4] : ''}`;
        if (user.value) user.value.cpf = input.value;
      }
    };

    const applyPhoneMask = (event: Event) => {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      const phoneParts = value.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      if (phoneParts) {
        input.value = !phoneParts[2] ? phoneParts[1] : `(${phoneParts[1]}) ${phoneParts[2]}${phoneParts[3] ? '-' + phoneParts[3] : ''}`;
        if (user.value) user.value.telefone = input.value;
      }
    };

    const logout = async () => {
      try {
        await axios.post(
          "http://localhost:3000/users/logout",
          {},
          { withCredentials: true }
        );
        user.value = null;
        window.location.href = "/";
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
    };

    const formatDate = (date: string) => {
      return dayjs(date).format("DD/MM/YYYY");
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      user,
      horarios,
      planos,
      showHorarios,
      showPlanos,
      toggleHorarios,
      togglePlanos,
      toggleEdit,
      saveUser,
      logout,
      loading,
      loadingHorarios,
      loadingPlanos,
      formatDate,
      isEditing,
      saving,
      errors,
      applyCpfMask,
      applyPhoneMask,
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
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  position: relative;
}

.edit-icon {
  cursor: pointer;
  font-size: 1.5rem;
  color: #4300a2;
  position: absolute;
  top: 10px;
  right: 10px;
  transition: color 0.3s, transform 0.3s;
}

.edit-icon:hover {
  transform: scale(1.2);
}

.edit-icon.active {
  color: #ff5858;
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
  flex-direction: column; /* Adjusted for better spacing */
  align-items: flex-start;
  position: relative;
}

.help-text {
  background: #f1f1f1;
  color: #333;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: left;
  font-size: 0.95rem;
}

input {
  width: 100%; /* Adjusted for full-width inputs */
  padding: 10px;
  margin-top: 5px;
  font-size: 1.2rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

input[readonly] {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

strong {
  color: #333;
}

.error {
  color: red;
  font-size: 0.875rem; /* Reduced font size for better readability */
  margin-top: 5px; /* Added margin for better spacing */
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save-button,
.logout-button,
.horarios-button,
.planos-button {
  background: linear-gradient(to right, #4300a2, #ff5858);
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
  margin: 10px 5px;
  flex: 1;
}

.save-button[disabled] {
  background: #ccc;
  cursor: not-allowed;
}

.save-button:hover,
.logout-button:hover,
.horarios-button:hover,
.planos-button:hover {
  background: linear-gradient(to left, #4300a2, #ff5858);
}

.extra-buttons {
  display: flex;
  justify-content: center;
}

.horarios-section,
.planos-section {
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

.horario,
.plano {
  background: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  color: black;
}

.horario p,
.plano p {
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
