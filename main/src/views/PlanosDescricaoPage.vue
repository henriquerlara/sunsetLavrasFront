<template>
    <div>
      <Header/>
      <div class="plans-page">
        <div class="plans">
          <div class="plan">
            <h2>Plano Mensal</h2>
            <p>Reserve um horário específico por semana, durante um mês (4 semanas). Aproveite um desconto em relação ao pagamento avulso.</p>
            <ul>
              <li>Reserva fixa semanal</li>
              <li>Desconto em relação ao pagamento avulso</li>
              <li>Cancelamento gratuito</li>
            </ul>
          </div>
          <div class="plan">
            <h2>Plano Trimestral</h2>
            <p>Reserve um horário específico por semana, por três meses (12 semanas). Desconto adicional em relação ao plano mensal e ao pagamento avulso.</p>
            <ul>
              <li>Reserva fixa semanal</li>
              <li>Desconto em relação ao plano mensal e avulso</li>
              <li>Cancelamento gratuito</li>
            </ul>
          </div>
          <div class="plan">
            <h2>Avulso (Sem Plano)</h2>
            <p>Pague por uso, ideal para quem joga ocasionalmente e prefere flexibilidade total. Sem compromisso de renovação.</p>
            <ul>
              <li>Acesso às quadras por hora</li>
              <li>Pagamento por uso</li>
            </ul>
          </div>
        </div>
        <router-link to="/planos">
        <button>VER PLANOS</button>
        </router-link>
      </div>
      <Footer/>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  import Header from '../components/Header.vue';
  import Footer from '../components/Footer.vue';
  
  export default defineComponent({
    name: 'PlansPage',
    components: {
      Header,
      Footer
    },
    setup() {
      const router = useRouter();
  
      const goToPlansPage = () => {
        router.push('/planos');
      };
  
      return {
        goToPlansPage,
      };
    },
  });
  </script>
  
  <style scoped>
  
  .plans-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
    min-height: 100vh;
    background:#f8f8f8;
    font-family: 'Montserrat', sans-serif;
  }
  
  h1 {
  margin-bottom: 40px;
  font-size: 3em;
  background: linear-gradient(135deg, #4300a2 0%, #ff5858 100%);
  border-radius: 10px;
  font-weight: 900; /* Tente um peso maior */
  padding: 10px;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
  
  .plans {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    width: 100%;
    height: 100%;
  }
  
  .plan {
    background: linear-gradient(135deg, #4300a2 0%, #ff5858 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
    width: 100%;
  }
  
  .plan h2 {
    margin-bottom: 10px;
    color: white;
    font-size: 1.5em;
  }
  
  .plan p {
    margin-bottom: 10px;
  }
  
  .plan ul {
    list-style-type: none;
    padding: 0;
  }
  
  .plan ul li {
    background: rgba(255, 255, 255, 0.2);
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
    color: white;
  }
  
  button {
  margin-top: 20px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #4300a2 0%, #ff5858 100%);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 25px;
  font-weight: bold;
  transition: background 0.3s;
}

button:hover {
  background: linear-gradient(135deg, #ff5858 0%, #4300a2 100%);
}
  </style>
  