<!-- src/views/CalendarPage.vue -->
<template>
  <div class="container">
    <HomeIcon />
    <h1>ESCOLHA UM HORÁRIO</h1>
    <div class="main">
      <CalendarView />
      <div class="legend">
        <div class="legend-item">
          <span class="dot red"></span> <span>Hoje</span>
        </div>
        <div class="legend-item">
          <span class="dot blue"></span> <span>Selecionado pelo usuário</span>
        </div>
      </div>
      <button class="next-button" @click="goToSelectTime">Próximo</button>
      <p v-if="showWarning" class="warning">Por favor, selecione uma data primeiro.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import CalendarView from '../../components/Calendar.vue';
import HomeIcon from '../../components/HomeIcon.vue';

export default defineComponent({
  name: 'CalendarPage',
  components: {
    CalendarView,
    HomeIcon,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const showWarning = ref(false);

    const goToSelectTime = () => {
      if (store.state.selectedDate === null) {
        showWarning.value = true;
      } else {
        router.push({ name: 'SelectTime' });
      }
    };

    return {
      goToSelectTime,
      showWarning,
    };
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #4300a2, #ff5858);
  position: relative;
}

.main {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: white;
  }

.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.dot.red {
  background-color: red;
}

.dot.blue {
  background-color: blue;
}

.next-button {
  background:  linear-gradient(to right, #4300a2, #ff5858);
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
  margin-top: 20px;
}

.next-button:hover {
  background:  linear-gradient(to left, #4300a2, #ff5858);
}

.warning {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>
