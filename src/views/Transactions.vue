<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-toolbar
            color="primary"
            density="comfortable"
          >
            <v-toolbar-title class="text-white">Transacciones</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              color="white"
              variant="outlined"
              prepend-icon="mdi-filter"
              class="mr-2"
              @click="showFilters = !showFilters"
            >
              Filtros
              <v-badge
                :content="activeFiltersCount"
                :model-value="activeFiltersCount > 0"
                color="error"
                offset-x="12"
                offset-y="-8"
              ></v-badge>
            </v-btn>
            <v-btn
              color="white"
              variant="outlined"
              prepend-icon="mdi-plus"
              @click="showAddDialog = true"
            >
              Nueva Transacción
            </v-btn>
          </v-toolbar>

          <v-expand-transition>
            <div v-if="showFilters">
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      v-model="filters.type"
                      :items="['Todos', 'ingreso', 'gasto']"
                      label="Tipo"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      v-model="filters.category"
                      :items="['Todas', ...categories]"
                      label="Categoría"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="filters.dateFrom"
                      label="Desde"
                      type="date"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="filters.dateTo"
                      label="Hasta"
                      type="date"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="filteredTransactions"
              :loading="loading"
              hover
              class="elevation-1"
            >
              <template #[`item.amount`]="{ item }">
                <div :class="item.type === 'ingreso' ? 'text-success font-weight-bold' : 'text-error font-weight-bold'">
                  {{ item.type === 'ingreso' ? '+' : '-' }}${{ formatCurrency(item.amount) }}
                </div>
              </template>

              <template #[`item.category`]="{ item }">
                <v-chip
                  :color="getCategoryColor(item.category)"
                  size="small"
                  class="text-white"
                >
                  {{ item.category }}
                </v-chip>
              </template>

              <template #[`item.actions`]="{ item }">
                <v-tooltip text="Editar">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      color="primary"
                      v-bind="props"
                      @click="editTransaction(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip text="Eliminar">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      color="error"
                      v-bind="props"
                      @click="confirmDelete(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para agregar/editar transacción -->
    <v-dialog
      v-model="showAddDialog"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title class="bg-primary text-white">
          {{ editedItem.id ? 'Editar' : 'Nueva' }} Transacción
          <v-spacer></v-spacer>
          <v-btn
            icon
            variant="text"
            @click="closeDialog"
            color="white"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="form" @submit.prevent="saveTransaction">
            <v-text-field
              v-model="editedItem.description"
              label="Descripción"
              :rules="[(v) => !!v || 'La descripción es requerida']"
              variant="outlined"
              density="comfortable"
            ></v-text-field>

            <v-text-field
              v-model.number="editedItem.amount"
              label="Monto"
              type="number"
              prefix="$"
              :rules="[
                (v) => !!v || 'El monto es requerido',
                (v) => v > 0 || 'El monto debe ser mayor a 0'
              ]"
              variant="outlined"
              density="comfortable"
            ></v-text-field>

            <v-select
              v-model="editedItem.type"
              :items="[
                { title: 'Ingreso', value: 'ingreso' },
                { title: 'Gasto', value: 'gasto' }
              ]"
              label="Tipo"
              :rules="[(v) => !!v || 'El tipo es requerido']"
              variant="outlined"
              density="comfortable"
            ></v-select>

            <v-select
              v-model="editedItem.category"
              :items="categories"
              label="Categoría"
              :rules="[(v) => !!v || 'La categoría es requerida']"
              variant="outlined"
              density="comfortable"
            ></v-select>

            <v-text-field
              v-model="editedItem.date"
              label="Fecha"
              type="date"
              :rules="[(v) => !!v || 'La fecha es requerida']"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="outlined"
            @click="closeDialog"
            class="mr-2"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="saveTransaction"
            :loading="saving"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog
      v-model="showDeleteDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="bg-error text-white">
          Confirmar Eliminación
        </v-card-title>
        <v-card-text class="pt-4">
          ¿Estás seguro de que quieres eliminar esta transacción? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            @click="deleteTransaction"
            :loading="deleting"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'TransactionsView',
  setup() {
    const loading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)
    const showAddDialog = ref(false)
    const showDeleteDialog = ref(false)
    const showFilters = ref(false)
    const form = ref(null)
    const itemToDelete = ref(null)

    const filters = ref({
      type: 'Todos',
      category: 'Todas',
      dateFrom: '',
      dateTo: ''
    })

    const headers = [
      { title: 'Fecha', key: 'date', align: 'start', sortable: true },
      { title: 'Descripción', key: 'description', align: 'start' },
      { title: 'Categoría', key: 'category', align: 'start' },
      { title: 'Monto', key: 'amount', align: 'end' },
      { title: 'Acciones', key: 'actions', align: 'center', sortable: false }
    ]

    const defaultItem = {
      description: '',
      amount: '',
      type: 'gasto',
      category: '',
      date: new Date().toISOString().substr(0, 10)
    }

    const editedItem = ref({ ...defaultItem })
    
    const transactions = ref([
      {
        id: 1,
        date: '2024-04-01',
        description: 'Salario',
        category: 'Ingresos',
        amount: 3500,
        type: 'ingreso'
      },
      {
        id: 2,
        date: '2024-04-02',
        description: 'Supermercado',
        category: 'Comida',
        amount: 150,
        type: 'gasto'
      }
    ])

    const categories = [
      'Ingresos',
      'Comida',
      'Transporte',
      'Entretenimiento',
      'Servicios',
      'Otros'
    ]

    const categoryColors = {
      'Ingresos': 'success',
      'Comida': 'orange',
      'Transporte': 'blue',
      'Entretenimiento': 'purple',
      'Servicios': 'cyan',
      'Otros': 'grey'
    }

    const activeFiltersCount = computed(() => {
      let count = 0
      if (filters.value.type !== 'Todos') count++
      if (filters.value.category !== 'Todas') count++
      if (filters.value.dateFrom) count++
      if (filters.value.dateTo) count++
      return count
    })

    const filteredTransactions = computed(() => {
      return transactions.value.filter(transaction => {
        if (filters.value.type !== 'Todos' && transaction.type !== filters.value.type) return false
        if (filters.value.category !== 'Todas' && transaction.category !== filters.value.category) return false
        if (filters.value.dateFrom && transaction.date < filters.value.dateFrom) return false
        if (filters.value.dateTo && transaction.date > filters.value.dateTo) return false
        return true
      })
    })

    const formatCurrency = (value) => {
      return value.toLocaleString('es-ES')
    }

    const getCategoryColor = (category) => {
      return categoryColors[category] || 'grey'
    }

    const editTransaction = (item) => {
      editedItem.value = { ...item }
      showAddDialog.value = true
    }

    const confirmDelete = (item) => {
      itemToDelete.value = item
      showDeleteDialog.value = true
    }

    const deleteTransaction = async () => {
      deleting.value = true
      try {
        const index = transactions.value.indexOf(itemToDelete.value)
        transactions.value.splice(index, 1)
        showDeleteDialog.value = false
      } finally {
        deleting.value = false
        itemToDelete.value = null
      }
    }

    const closeDialog = () => {
      showAddDialog.value = false
      editedItem.value = { ...defaultItem }
    }

    const saveTransaction = async () => {
      if (!form.value.validate()) return

      saving.value = true
      try {
        if (editedItem.value.id) {
          const index = transactions.value.findIndex(item => item.id === editedItem.value.id)
          transactions.value[index] = { ...editedItem.value }
        } else {
          transactions.value.push({
            id: transactions.value.length + 1,
            ...editedItem.value
          })
        }
        closeDialog()
      } finally {
        saving.value = false
      }
    }

    return {
      loading,
      saving,
      deleting,
      showAddDialog,
      showDeleteDialog,
      showFilters,
      form,
      filters,
      headers,
      transactions,
      filteredTransactions,
      editedItem,
      categories,
      activeFiltersCount,
      formatCurrency,
      getCategoryColor,
      editTransaction,
      confirmDelete,
      deleteTransaction,
      closeDialog,
      saveTransaction
    }
  }
}
</script>

<style scoped>
.text-success {
  color: var(--v-success-base) !important;
}

.text-error {
  color: var(--v-error-base) !important;
}

.v-data-table {
  border-radius: var(--card-border-radius);
}

.v-data-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style> 