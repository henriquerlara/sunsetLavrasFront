<template>
    <div class="container">
      <Header/>
      <HomeBanner/>
      <WelcomeBanner/>
      <Footer/>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import Header from '@/components/Header.vue';
  import HomeBanner from '../components/HomeBanner.vue';
  import WelcomeBanner from '../components/WelcomeBanner.vue';
  import Footer from '../components/Footer.vue';
  
  export default defineComponent({
    name: 'Home',
    components: {
      Header,
      HomeBanner,
      WelcomeBanner,
      Footer
    }
  });
  </script>
  
  <style scoped>

  </style>
  