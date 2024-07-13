<template>
    <div class="container">
      <Header/>
      <HomeBanner/>
      <WelcomeBanner/>
      <PlanosBanner/>
      <AulasBanner/>
      <Footer/>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import Header from '@/components/Header.vue';
  import HomeBanner from '../components/home/HomeBanner.vue';
  import WelcomeBanner from '../components/home/WelcomeBanner.vue';
  import Footer from '../components/Footer.vue';
  import PlanosBanner from '../components/home/PlanosBanner.vue'
  import AulasBanner from '../components/home/AulasBanner.vue'
  
  export default defineComponent({
    name: 'Home',
    components: {
      Header,
      HomeBanner,
      WelcomeBanner,
      Footer,
      PlanosBanner,
      AulasBanner
    }
  });
  </script>
  
  <style scoped>

  </style>
  