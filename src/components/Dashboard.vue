<template>
  <v-container fluid class="pa-1">
    <v-row dense>
      <!-- Tarjetas de resumen -->
      <v-col cols="12" sm="6" lg="3" class="pa-1">
        <v-card elevation="2" class="dashboard-card">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="primary" size="large" class="mr-2">mdi-wallet</v-icon>
              <div class="text-subtitle-1">Balance Total</div>
            </div>
            <div class="text-h4 mt-2">${{ formatCurrency(totalBalance) }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3" class="pa-1">
        <v-card elevation="2" class="dashboard-card">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="success" size="large" class="mr-2">mdi-arrow-up-bold</v-icon>
              <div class="text-subtitle-1">Ingresos Totales</div>
            </div>
            <div class="text-h4 mt-2 text-success">${{ formatCurrency(totalIncome) }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3" class="pa-1">
        <v-card elevation="2" class="dashboard-card">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="error" size="large" class="mr-2">mdi-arrow-down-bold</v-icon>
              <div class="text-subtitle-1">Gastos Totales</div>
            </div>
            <div class="text-h4 mt-2 text-error">${{ formatCurrency(totalExpenses) }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3" class="pa-1">
        <v-card elevation="2" class="dashboard-card">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="info" size="large" class="mr-2">mdi-piggy-bank</v-icon>
              <div class="text-subtitle-1">Ahorro Estimado</div>
            </div>
            <div class="text-h4 mt-2 text-info">${{ formatCurrency(estimatedSavings) }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráficos -->
      <v-col cols="12" lg="6" class="pa-1">
        <v-card elevation="2" class="chart-card">
          <v-card-title class="d-flex align-center pa-2">
            <v-icon color="primary" class="mr-2">mdi-chart-pie</v-icon>
            <span class="text-truncate">Gastos por Categoría</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="chart-container pie-chart pa-0">
            <pie-chart :data="spendingByCategory" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6" class="pa-1">
        <v-card elevation="2" class="chart-card">
          <v-card-title class="d-flex align-center pa-2">
            <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
            <span class="text-truncate">Ingresos vs. Gastos</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="chart-container line-chart pa-0">
            <line-chart :data="incomeVsExpenses" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Recomendaciones -->
      <v-col cols="12" class="pa-1">
        <v-card elevation="2" class="recommendation-card">
          <v-card-title class="d-flex align-center pa-2">
            <v-icon color="info" class="mr-2">mdi-lightbulb</v-icon>
            <span class="text-truncate">Recomendaciones Financieras</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-2">
            <v-alert
              type="info"
              text
              class="mb-4"
              variant="tonal"
            >
              {{ aiRecommendation }}
            </v-alert>
            <v-btn
              color="primary"
              class="mt-2"
              @click="viewAdvice"
            >
              Ver Consejos
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import PieChart from './PieChart.vue'
import LineChart from './LineChart.vue'

export default {
  name: 'FinanceDashboard',
  components: {
    PieChart,
    LineChart
  },
  setup() {
    const totalBalance = ref(5100)
    const totalIncome = ref(3500)
    const totalExpenses = ref(2800)
    const estimatedSavings = ref(700)
    
    const spendingByCategory = ref({
      'Comida': 800,
      'Transporte': 500,
      'Entretenimiento': 300,
      'Servicios': 700,
      'Otros': 500
    })
    
    const incomeVsExpenses = ref({
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      income: [3000, 3200, 3500, 3400, 3600, 3500],
      expenses: [2500, 2700, 2800, 2900, 3000, 2800]
    })
    
    const aiRecommendation = ref('Basado en tus gastos actuales, podrías ahorrar un 20% más si reduces tus gastos en entretenimiento y servicios. Considera establecer un presupuesto mensual para estas categorías.')
    
    const formatCurrency = (value) => {
      return value.toLocaleString('es-ES')
    }
    
    const viewAdvice = () => {
      // Implementar lógica para ver consejos detallados
      console.log('Ver consejos detallados')
    }
    
    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      estimatedSavings,
      spendingByCategory,
      incomeVsExpenses,
      aiRecommendation,
      formatCurrency,
      viewAdvice
    }
  }
}
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.chart-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.chart-container.line-chart {
  min-height: 280px;
  max-height: 380px;
}

.chart-container.pie-chart {
  min-height: 280px;
  max-height: 380px;
}

.recommendation-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.text-success {
  color: var(--v-success-base) !important;
}

.text-error {
  color: var(--v-error-base) !important;
}

.text-info {
  color: var(--v-info-base) !important;
}

@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.25rem !important;
  }
  
  .text-subtitle-1 {
    font-size: 0.875rem !important;
  }

  .chart-container.line-chart,
  .chart-container.pie-chart {
    min-height: 250px;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .chart-container.line-chart,
  .chart-container.pie-chart {
    min-height: 300px;
  }
}
</style> 