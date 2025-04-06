import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  const login = async ({ email, password }) => {
    try {
      // Simulamos validación de contraseña
      if (!password) throw new Error('Contraseña requerida')
      
      const response = {
        user: {
          id: 1,
          name: 'Usuario Demo',
          email: email
        },
        token: 'demo-token'
      }

      user.value = response.user
      token.value = response.token
      isAuthenticated.value = true
      localStorage.setItem('token', response.token)

      return response
    } catch (error) {
      throw new Error('Error en la autenticación')
    }
  }

  const register = async ({ name, email, password }) => {
    try {
      // Simulamos validación de contraseña
      if (!password) throw new Error('Contraseña requerida')
      
      const response = {
        user: {
          id: 1,
          name: name,
          email: email
        },
        token: 'demo-token'
      }

      user.value = response.user
      token.value = response.token
      isAuthenticated.value = true
      localStorage.setItem('token', response.token)

      return response
    } catch (error) {
      throw new Error('Error en el registro')
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout
  }
}) 