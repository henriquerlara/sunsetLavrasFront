<template>
  <div id="app" class="container">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}
html, body{
  width: 100%;
  height: 100%;
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
}
</style>
