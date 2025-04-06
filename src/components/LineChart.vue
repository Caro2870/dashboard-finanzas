<template>
  <div class="chart-container">
    <apexchart
      type="line"
      :options="chartOptions"
      :series="series"
      width="300%"
      height="100%"
    />
  </div>
</template>

<script>
import {  computed, watch, onMounted, onUnmounted } from 'vue'
import { useTheme } from 'vuetify'

export default {
  name: 'LineChartComponent',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const theme = useTheme()
    const series = computed(() => [
      {
        name: 'Ingresos',
        data: props.data.income
      },
      {
        name: 'Gastos',
        data: props.data.expenses
      }
    ])

    const chartOptions = computed(() => ({
      chart: {
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        redrawOnWindowResize: true,
        redrawOnParentResize: true,
        foreColor: theme.current.value.dark ? '#E0E0E0' : '#333333'
      },
      colors: theme.current.value.dark ? 
        ['#64B5F6', '#81C784'] : // Azul más claro y verde más claro para modo oscuro
        ['#1976D2', '#388E3C'], // Azul más oscuro y verde más oscuro para modo claro
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: props.data.labels,
        labels: {
          style: {
            fontSize: '12px',
            colors: theme.current.value.dark ? '#E0E0E0' : '#333333'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => {
            return '$' + value.toLocaleString('es-ES')
          },
          style: {
            fontSize: '12px',
            colors: theme.current.value.dark ? '#E0E0E0' : '#333333'
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '14px',
        labels: {
          colors: theme.current.value.dark ? '#E0E0E0' : '#333333'
        },
        markers: {
          width: 12,
          height: 12,
          radius: 6
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: theme.current.value.dark ? '#404040' : '#f1f1f1',
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }
      },
      tooltip: {
        theme: theme.current.value.dark ? 'dark' : 'light',
        y: {
          formatter: (value) => {
            return '$' + value.toLocaleString('es-ES')
          }
        }
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            legend: {
              position: 'bottom',
              offsetY: 0
            }
          }
        }
      ]
    }))

    // Observar cambios en el tema
    watch(() => theme.current.value.dark, () => {
      // Forzar actualización del gráfico cuando cambia el tema
      chartOptions.value = { ...chartOptions.value }
    })

    watch(() => props.data, (newVal) => {
      series.value = [
        {
          name: 'Ingresos',
          data: newVal.income
        },
        {
          name: 'Gastos',
          data: newVal.expenses
        }
      ]
      chartOptions.value.xaxis.categories = newVal.labels
    }, { deep: true })

    // Función para manejar el redimensionamiento
    const handleResize = () => {
      // Forzar actualización del gráfico cuando cambia el tamaño
      if (window.ApexCharts) {
        const chart = window.ApexCharts.getChartByID('lineChart')
        if (chart) {
          chart.updateOptions(chartOptions.value)
        }
      }
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      series,
      chartOptions
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--card-border-radius);
  aspect-ratio: 2.5;
}

:deep(.apexcharts-canvas) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.apexcharts-legend) {
  padding: 0 !important;
  margin: 0 !important;
}
</style> 