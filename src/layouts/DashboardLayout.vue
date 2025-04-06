<template>
  <v-main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-main>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'DashboardLayout',
  setup() {
    const authStore = useAuthStore()
    
    return {
      authStore
    }
  }
}
</script> 