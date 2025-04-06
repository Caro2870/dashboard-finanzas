<template>
  <v-app>
    <v-main class="auth-background">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
// No se necesita lógica adicional por ahora
</script>

<style scoped>
.auth-background {
  background: linear-gradient(135deg, #1B4965 0%, #62B6CB 100%);
}
</style> 