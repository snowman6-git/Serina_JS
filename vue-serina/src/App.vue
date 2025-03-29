<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div id="nav">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">어바웃</RouterLink>
    <RouterLink to="/report">리포트</RouterLink>
  </div>
  
  <RouterView></RouterView>
</template>

<style scoped>
#nav{
  position: fixed;
  gap: 1rem;
  width: 100%;
  display: flex;
  bottom: 0px;
  left: 0px;
}
a{
  font-size: 2rem;
  color: white;
  text-decoration: none;
}
</style>
