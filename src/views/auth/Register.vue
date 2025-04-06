<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-4">
          <v-card-title class="text-h5 text-center">Registro</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister" ref="form">
              <v-text-field
                v-model="name"
                label="Nombre completo"
                required
                :rules="[rules.required]"
                prepend-icon="mdi-account"
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="Correo electrónico"
                type="email"
                required
                :rules="[rules.required, rules.email]"
                prepend-icon="mdi-email"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Contraseña"
                :type="showPassword ? 'text' : 'password'"
                required
                :rules="[rules.required, rules.min]"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Confirmar contraseña"
                :type="showPassword ? 'text' : 'password'"
                required
                :rules="[rules.required, rules.passwordMatch]"
                prepend-icon="mdi-lock-check"
              ></v-text-field>

              <v-btn
                color="primary"
                block
                type="submit"
                :loading="loading"
                class="mt-4"
              >
                Registrarse
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              variant="text"
              @click="$router.push('/auth/login')"
            >
              ¿Ya tienes cuenta? Inicia sesión
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
  name: 'UserRegister',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const form = ref(null)
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const showPassword = ref(false)
    const loading = ref(false)

    const rules = {
      required: v => !!v || 'Este campo es requerido',
      email: v => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
      min: v => v.length >= 6 || 'Mínimo 6 caracteres',
      passwordMatch: v => v === password.value || 'Las contraseñas no coinciden'
    }

    const handleRegister = async () => {
      const { valid } = await form.value.validate()
      
      if (valid) {
        loading.value = true
        try {
          await authStore.register({
            name: name.value,
            email: email.value,
            password: password.value
          })
          router.push('/dashboard')
        } catch (error) {
          console.error('Error al registrarse:', error)
        } finally {
          loading.value = false
        }
      }
    }

    return {
      form,
      name,
      email,
      password,
      confirmPassword,
      showPassword,
      loading,
      rules,
      handleRegister
    }
  }
}
</script> 