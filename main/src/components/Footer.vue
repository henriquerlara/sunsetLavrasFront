<template>
    <footer class="site-footer">
      <div class="container">
        <div class="contact-info">
          <a href="mailto:arenasunsetlavras@gmail.com">arenasunsetlavras@gmail.com</a>
          <a href="https://www.instagram.com/sunsetarenalavras/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <div class="copyright">
          ©2024 por Sunset Arena Lavras.
        </div>
      </div>
    </footer>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Footer'
  });
  </script>
  
  <style scoped>
  
  .site-footer {
    background: linear-gradient(to right, #4300a2, #ff5858);
    color: white;
    padding: 20px 0;
  }
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .contact-info a {
    color: white;
    text-decoration: none;
    font-size: 16px;
    margin-bottom: 5px;
    transition: color 0.3s;
  }
  
  .contact-info a:hover {
    color: #ffdd57;
  }
  
  .copyright {
    font-size: 14px;
    text-align: right;
  }
  
  @media (max-width: 768px) {
    .container {
      flex-direction: column;
      align-items: center;
    }
  
    .contact-info {
      align-items: center;
      margin-bottom: 10px;
    }
  
    .copyright {
      text-align: center;
    }
  }
  </style>
  