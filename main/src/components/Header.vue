<template>
  <header class="sunset-header">
    <div class="container">
      <div class="logo">
        <h1>Sunset Lavras</h1>
      </div>
      <nav :class="['navigation', { open: isMenuOpen }]">
        <div class="menu-item"><a href="#">Página inicial</a></div>
        <div class="menu-item"><a href="#">Sobre</a></div>
        <div class="menu-item"><a href="#">Serviços</a></div>
        <div class="menu-item"><a href="#">Agendamento online</a></div>
        <div class="menu-item"><a href="#">Planos e preços</a></div>
      </nav>
      <div class="login" v-if="user">
        <a href="/account" class="login-link">
          <font-awesome-icon :icon="['fas', 'user-circle']" class="login-icon" />
          <span>{{ user.name }}</span>
        </a>
      </div>
      <div class="login" v-else>
        <a href="/login" class="login-link">
          <font-awesome-icon :icon="['fas', 'user-circle']" class="login-icon" />
          <span>Fazer login</span>
        </a>
      </div>
      <div class="menu-toggle">
        <font-awesome-icon :icon="['fas', 'bars']" @click="toggleMenu" />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  password: string;
}

export default defineComponent({
  name: 'Header',
  setup() {
    const isMenuOpen = ref(false);
    const user = ref<User | null>(null);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const checkUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/account', { withCredentials: true });
        if (response.data && response.data.user) {
          user.value = response.data.user;
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    };

    onMounted(() => {
      checkUser();
    });

    return {
      isMenuOpen,
      user,
      toggleMenu,
    };
  },
});
</script>

<style scoped>

.sunset-header {
  width: 100%;
  background: linear-gradient(to right, #4300a2, #ff5858);
  color: white;
  padding: 40px;
  margin: 0;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo {
  flex-shrink: 0;
}

.logo h1 {
  margin: 0;
  font-size: 2.5rem; 
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase; 
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex-grow: 1;
  justify-content: center;
}

.menu-item {
  display: flex;
}

.menu-item a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s, color 0.3s;
  font-weight: 700; 
  letter-spacing: 1px; 
  text-transform: uppercase; 
}

.menu-item a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.login {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.login-link {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: background-color 0.3s, color 0.3s;
  padding: 0.5rem 1rem;
  font-weight: 700; 
  letter-spacing: 1px; 
  text-transform: uppercase; 
}

.login-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.login-icon {
  font-size: 24px;
  margin-right: 0.5rem;
}

.menu-toggle {
  display: none;
  font-size: 24px;
  cursor: pointer;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: flex-start;
  }

  .logo {
    margin-bottom: 20px;
  }

  .navigation {
    flex-direction: column;
    align-items: flex-start;
    display: none; /* Esconder o menu inicialmente */
  }

  .navigation.open {
    display: flex; /* Mostrar o menu quando aberto */
  }

  .menu-item {
    width: 100%;
  }

  .menu-item a {
    padding: 10px 20px;
    width: 100%;
    text-align: left;
  }

  .login {
    margin-top: 20px;
  }

  .menu-toggle {
    display: block; /* Mostrar o ícone de menu hambúrguer */
  }
}

@media (max-width: 480px) {
  .logo h1 {
    font-size: 2rem;
  }

  .menu-item a {
    font-size: 0.875rem;
  }

  .login-link {
    font-size: 0.875rem;
  }

  .login-icon {
    font-size: 20px;
  }
}
</style>
