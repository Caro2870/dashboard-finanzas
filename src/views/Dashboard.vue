<template>
  <v-container fluid>
    <FinanceDashboard />
  </v-container>
</template>

<script>
import FinanceDashboard from '@/components/Dashboard.vue'

export default {
  name: 'DashboardView',
  components: {
    FinanceDashboard
  }
}
</script> 