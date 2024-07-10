<template>
    <div class="container">
      <Header/>
      <h1>My page</h1>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import Header from '@/components/Header.vue';
  
  export default defineComponent({
    name: 'Home',
    components: {
      Header
    }
  });
  </script>
  
  <style scoped>

  </style>
  