<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Configuración de Usuario</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="userSettings.name"
                label="Nombre"
                required
              ></v-text-field>

              <v-text-field
                v-model="userSettings.email"
                label="Correo electrónico"
                type="email"
                required
              ></v-text-field>

              <v-select
                v-model="userSettings.currency"
                :items="currencies"
                label="Moneda predeterminada"
                required
              ></v-select>

              <v-select
                v-model="userSettings.language"
                :items="languages"
                label="Idioma"
                required
              ></v-select>

              <v-btn
                color="primary"
                block
                class="mt-4"
                @click="saveSettings"
                :loading="loading"
              >
                Guardar Cambios
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Notificaciones</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-checkbox
                    v-model="notifications.email"
                    hide-details
                  ></v-checkbox>
                </template>
                <v-list-item-title>Notificaciones por correo</v-list-item-title>
                <v-list-item-subtitle>Recibe alertas sobre tus gastos</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-checkbox
                    v-model="notifications.budget"
                    hide-details
                  ></v-checkbox>
                </template>
                <v-list-item-title>Alertas de presupuesto</v-list-item-title>
                <v-list-item-subtitle>Cuando te acerques al límite</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-checkbox
                    v-model="notifications.reports"
                    hide-details
                  ></v-checkbox>
                </template>
                <v-list-item-title>Reportes semanales</v-list-item-title>
                <v-list-item-subtitle>Resumen de tus finanzas</v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-btn
              color="primary"
              block
              class="mt-4"
              @click="saveNotifications"
              :loading="loading"
            >
              Guardar Notificaciones
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>Exportar Datos</v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              block
              prepend-icon="mdi-download"
              @click="exportData"
              :loading="exporting"
            >
              Exportar a Excel
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'UserSettingsView',
  setup() {
    const authStore = useAuthStore()
    const form = ref(null)
    const loading = ref(false)
    const exporting = ref(false)

    const userSettings = ref({
      name: authStore.user?.name || '',
      email: authStore.user?.email || '',
      currency: 'USD',
      language: 'es'
    })

    const notifications = ref({
      email: true,
      budget: true,
      reports: false
    })

    const currencies = [
      { title: 'Dólar estadounidense (USD)', value: 'USD' },
      { title: 'Euro (EUR)', value: 'EUR' },
      { title: 'Peso mexicano (MXN)', value: 'MXN' }
    ]

    const languages = [
      { title: 'Español', value: 'es' },
      { title: 'English', value: 'en' }
    ]

    const saveSettings = async () => {
      loading.value = true
      try {
        // Aquí iría la lógica para guardar la configuración
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Simular éxito
        loading.value = false
      } catch (error) {
        console.error('Error al guardar la configuración:', error)
        loading.value = false
      }
    }

    const saveNotifications = async () => {
      loading.value = true
      try {
        // Aquí iría la lógica para guardar las notificaciones
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Simular éxito
        loading.value = false
      } catch (error) {
        console.error('Error al guardar las notificaciones:', error)
        loading.value = false
      }
    }

    const exportData = async () => {
      exporting.value = true
      try {
        // Aquí iría la lógica para exportar datos
        await new Promise(resolve => setTimeout(resolve, 2000))
        // Simular descarga
        exporting.value = false
      } catch (error) {
        console.error('Error al exportar datos:', error)
        exporting.value = false
      }
    }

    return {
      form,
      loading,
      exporting,
      userSettings,
      notifications,
      currencies,
      languages,
      saveSettings,
      saveNotifications,
      exportData
    }
  }
}
</script> 