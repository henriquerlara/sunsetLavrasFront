<template>
  <header class="sunset-header">
    <div class="container">
      <div class="logo">
        <h1>Sunset Lavras</h1>
      </div>
      <nav class="navigation">
        <div class="menu-item"><a href="#">Página inicial</a></div>
        <div class="menu-item"><a href="#">Sobre</a></div>
        <div class="menu-item"><a href="#">Serviços</a></div>
        <div class="menu-item"><a href="#">Agendamento online</a></div>
        <div class="menu-item"><a href="#">Planos e preços</a></div>
      </nav>
      <div class="login">
        <a href="#" class="login-link">
          <font-awesome-icon :icon="['fas', 'user-circle']" class="login-icon" />
          <span>Fazer login</span>
        </a>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header'
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

.sunset-header {
  width: 100%;
  background: linear-gradient(to right, #f857a6, #ff5858);
  color: white;
  padding: 30px;
  font-family: 'Montserrat', sans-serif; /* Fonte personalizada */
  margin: 0;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo {
  margin-right: 100px;
}

.logo h1 {
  margin: 0;
  font-size: 2.5rem; /* Tamanho da fonte */
  font-weight: 700; /* Peso da fonte */
  letter-spacing: 2px; /* Espaçamento entre letras */
  text-transform: uppercase; /* Letras maiúsculas */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3); /* Sombra do texto mais sutil */
}

.navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
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
  font-family: 'Montserrat', sans-serif; /* Fonte personalizada */
  font-weight: 700; /* Peso da fonte */
  letter-spacing: 1px; /* Espaçamento entre letras */
  text-transform: uppercase; /* Letras maiúsculas */
}

.menu-item a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.login {
  display: flex;
  align-items: center;
  margin-left: 100px;
  margin-right: 0;
}

.login-link {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: background-color 0.3s, color 0.3s;
  padding: 0.5rem 1rem;
  font-family: 'Montserrat', sans-serif; /* Fonte personalizada */
  font-weight: 700; /* Peso da fonte */
  letter-spacing: 1px; /* Espaçamento entre letras */
  text-transform: uppercase; /* Letras maiúsculas */
}

.login-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.login-icon {
  font-size: 24px;
  margin-right: 0.5rem;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: flex-start;
  }

  .logo {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .navigation {
    flex-direction: column;
    align-items: flex-start;
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
    margin-left: 0;
    margin-top: 20px;
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
