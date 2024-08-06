<template>
  <div class="home-banner">
    <div class="overlay">
      <div class="content">
        <h1>Seja Bem Vindo!</h1>
        <p>Conheça a Sunset Arena Lavras, muito mais que um complexo de quadras de esportes de areia! Venha nos visitar!</p>
        <button @click="goToCalendar">Agendar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HomeBanner',
  setup() {
    const router = useRouter();
    
    const goToCalendar = () => {
      router.push({ name: 'Planos' });
    };

    return {
      goToCalendar
    };
  }
});
</script>

<style scoped>
.home-banner {
  position: relative;
  width: 100%;
  height: 80vh;
  background: url('@/assets/quadras.jpg') no-repeat center center/cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content {
  background: white;
  padding: 32px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 90%;
}

h1 {
  font-size: 48px;
  color: #f857a6;
  margin-bottom: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

p {
  font-size: 20px;
  color: #333;
  margin-bottom: 32px;
  font-weight: 400;
}

button {
  background-color: #f857a6;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

button:hover {
  background-color: #ff5858;
}

/* Estilos responsivos para HomeBanner */
@media (max-width: 768px) {
  .home-banner {
    height: auto;
  }

  .overlay {
    position: static;
    background: none;
    padding: 5rem 0;
  }

  .content {
    width: 90%;
  }

  h1 {
    font-size: 32px;
  }

  p {
    font-size: 16px;
  }

  button {
    padding: 12px 24px;
    font-size: 14px;
  }
}

</style>
