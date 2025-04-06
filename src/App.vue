<template>
  <v-app :theme="theme">
    <v-navigation-drawer
      v-if="!isAuthRoute"
      v-model="drawer"
      app
      class="elevation-4"
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
          :title="userName"
          :subtitle="userEmail"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          class="mb-1"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list>
          <v-list-item
            prepend-icon="mdi-brightness-6"
            title="Cambiar tema"
            @click="toggleTheme"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar sesión"
            @click="logout"
          ></v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      v-if="!isAuthRoute"
      app
      elevation="1"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Finanzas Personales</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="showNotifications">
        <v-badge
          :content="notificationCount"
          :model-value="notificationCount > 0"
          color="error"
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>

    <v-main class="bg-background pa-0">
      <v-container fluid class="pa-0">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  setup() {
    const drawer = ref(true)
    const theme = ref('light')
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()
    const notificationCount = ref(2)

    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })

    const menuItems = [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
      { title: 'Transacciones', icon: 'mdi-swap-horizontal', to: '/transactions' },
      { title: 'Categorías', icon: 'mdi-shape', to: '/categories' },
      { title: 'Configuración', icon: 'mdi-cog', to: '/settings' }
    ]

    const userName = computed(() => authStore.user?.name || 'Usuario')
    const userEmail = computed(() => authStore.user?.email || 'usuario@ejemplo.com')

    const isAuthRoute = computed(() => {
      return route.path.includes('/auth') || route.path === '/login'
    })

    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    const showNotifications = () => {
      snackbar.value = {
        show: true,
        text: 'Tienes nuevas notificaciones pendientes',
        color: 'info'
      }
    }

    const logout = async () => {
      await authStore.logout()
      router.push('/auth/login')
    }

    return {
      drawer,
      theme,
      menuItems,
      userName,
      userEmail,
      notificationCount,
      snackbar,
      toggleTheme,
      showNotifications,
      logout,
      isAuthRoute
    }
  }
}
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}

.v-main {
  transition: background-color var(--transition-speed) ease;
}

.v-card {
  border-radius: var(--card-border-radius) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-btn {
  border-radius: var(--button-border-radius) !important;
  text-transform: none !important;
}

.v-navigation-drawer {
  border-radius: 0 16px 16px 0;
}
</style>
