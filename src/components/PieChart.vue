<template>
  <div class="chart-container">
    <apexchart
      type="donut"
      :options="chartOptions"
      :series="series"
      width="100%"
      height="100%"
    />
  </div>
</template>

<script>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useTheme } from 'vuetify'

export default {
  name: 'PieChartComponent',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const theme = useTheme()
    const series = computed(() => Object.values(props.data))

    const chartOptions = computed(() => ({
      chart: {
        type: 'donut',
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
      labels: Object.keys(props.data),
      colors: theme.current.value.dark ? 
        ['#82B1FF', '#4CAF50', '#FF8A65', '#BA68C8', '#64B5F6'] : 
        ['#1B4965', '#62B6CB', '#5FA8D3', '#CAE9F5', '#98C1D9'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
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
          horizontal: 2,
          vertical: 2
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%'
          },
          legend: {
            position: 'bottom',
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontWeight: 600,
                color: theme.current.value.dark ? '#E0E0E0' : undefined
              },
              value: {
                show: true,
                fontSize: '16px',
                fontWeight: 600,
                color: theme.current.value.dark ? '#E0E0E0' : undefined,
                formatter: function (val) {
                  return '$' + val.toLocaleString('es-ES')
                }
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '16px',
                fontWeight: 600,
                color: theme.current.value.dark ? '#E0E0E0' : undefined,
                formatter: function (w) {
                  return '$' + w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString('es-ES')
                }
              }
            }
          }
        }
      },
      tooltip: {
        theme: theme.current.value.dark ? 'dark' : 'light',
        y: {
          formatter: (value) => {
            return '$' + value.toLocaleString('es-ES')
          }
        }
      }
    }))

    watch(() => props.data, (newVal) => {
      series.value = Object.values(newVal)
      chartOptions.value.labels = Object.keys(newVal)
    }, { deep: true })

    // Observar cambios en el tema
    watch(() => theme.current.value.dark, () => {
      // Forzar actualización del gráfico cuando cambia el tema
      chartOptions.value = { ...chartOptions.value }
    })

    // Función para manejar el redimensionamiento
    const handleResize = () => {
      // Forzar actualización del gráfico cuando cambia el tamaño
      if (window.ApexCharts) {
        const chart = window.ApexCharts.getChartByID('pieChart')
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
  overflow: hidden;
  border-radius: var(--card-border-radius);
  padding-bottom: 60px;
}

:deep(.apexcharts-canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style> 