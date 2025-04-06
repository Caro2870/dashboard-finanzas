<template>
  <v-container fluid class="login-container pa-0">
    <v-row no-gutters style="min-height: 100vh;" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4" class="pa-4">
        <v-card class="login-card mx-auto" elevation="8">
          <div class="login-header text-center pa-6">
            <v-icon size="48" color="primary" class="mb-4">mdi-wallet-outline</v-icon>
            <h1 class="text-h4 font-weight-bold mb-2">Bienvenido</h1>
            <p class="text-subtitle-1 text-medium-emphasis">Inicia sesión para continuar</p>
          </div>

          <v-card-text class="px-6 pt-2">
            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field
                v-model="email"
                label="Correo electrónico"
                type="email"
                required
                :rules="[rules.required, rules.email]"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="comfortable"
                class="mb-4 login-input"
                color="primary"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Contraseña"
                :type="showPassword ? 'text' : 'password'"
                required
                :rules="[rules.required, rules.min]"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                density="comfortable"
                class="mb-2 login-input"
                color="primary"
              ></v-text-field>

              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox
                  v-model="rememberMe"
                  label="Recordarme"
                  color="primary"
                  hide-details
                  class="mt-0"
                ></v-checkbox>
                <v-btn
                  variant="text"
                  color="primary"
                  class="text-caption"
                  @click="forgotPassword"
                >
                  ¿Olvidaste tu contraseña?
                </v-btn>
              </div>

              <v-btn
                color="primary"
                block
                type="submit"
                :loading="loading"
                size="large"
                class="login-button mb-4"
                elevation="2"
              >
                <v-icon left class="mr-2">mdi-login</v-icon>
                Iniciar Sesión
              </v-btn>
            </v-form>
          </v-card-text>

          <v-divider class="mb-4"></v-divider>

          <v-card-actions class="justify-center pb-6 px-6">
            <p class="text-medium-emphasis me-2">¿No tienes una cuenta?</p>
            <v-btn
              variant="text"
              color="primary"
              class="font-weight-bold"
              @click="$router.push('/auth/register')"
            >
              Regístrate aquí
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'UserLogin',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const form = ref(null)
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const loading = ref(false)
    const rememberMe = ref(false)

    const rules = {
      required: v => !!v || 'Este campo es requerido',
      email: v => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
      min: v => v.length >= 6 || 'Mínimo 6 caracteres'
    }

    const handleLogin = async () => {
      const { valid } = await form.value.validate()
      
      if (valid) {
        loading.value = true
        try {
          await authStore.login({
            email: email.value,
            password: password.value
          })
          router.push('/dashboard')
        } catch (error) {
          console.error('Error al iniciar sesión:', error)
        } finally {
          loading.value = false
        }
      }
    }

    const forgotPassword = () => {
      // Implementar lógica para recuperar contraseña
      console.log('Recuperar contraseña')
    }

    return {
      form,
      email,
      password,
      showPassword,
      loading,
      rememberMe,
      rules,
      handleLogin,
      forgotPassword
    }
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, var(--v-theme-secondary) 100%);
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  max-width: 100%;
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.98) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.login-header {
  background: linear-gradient(to right, var(--v-theme-surface), var(--v-theme-surface-variant));
  border-radius: 16px 16px 0 0;
}

.login-input :deep(.v-field) {
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.login-input :deep(.v-field:hover) {
  transform: translateY(-2px);
}

.login-input :deep(.v-field--focused) {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.1);
}

.login-button {
  border-radius: 12px !important;
  text-transform: none !important;
  letter-spacing: 0.5px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.2) !important;
}

@media (max-width: 600px) {
  .login-card {
    margin: 16px;
    border-radius: 24px !important;
  }

  .login-header {
    border-radius: 24px 24px 0 0;
  }
}
</style> 