<!-- src/components/HomeIcon.vue -->
<template>
    <router-link to="/" class="icon-container">
      <font-awesome-icon :icon="['fas', 'home']" class="home-icon" />
    </router-link>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  
  export default defineComponent({
    name: 'HomeIcon',
    components: {
      FontAwesomeIcon,
    },
  });
  </script>
  
  <style scoped>
  .icon-container {
    position: absolute;
    top: 20px;
    left: 20px;
  }
  
  .home-icon {
    font-size: 24px;
    color: white;
  }
  </style>
  