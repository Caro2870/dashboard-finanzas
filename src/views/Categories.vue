<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex align-center">
            Categorías
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="showAddDialog = true"
            >
              Nueva Categoría
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item
                v-for="category in categories"
                :key="category.id"
                :value="category"
              >
                <template v-slot:prepend>
                  <v-icon :color="category.color">{{ category.icon }}</v-icon>
                </template>

                <v-list-item-title>{{ category.name }}</v-list-item-title>

                <template v-slot:append>
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click="editCategory(category)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    color="error"
                    @click="deleteCategory(category)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Distribución de Gastos por Categoría</v-card-title>
          <v-card-text>
            <pie-chart :data="categoryDistribution" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para agregar/editar categoría -->
    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editedItem.id ? 'Editar' : 'Nueva' }} Categoría
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="editedItem.name"
              label="Nombre"
              required
            ></v-text-field>

            <v-select
              v-model="editedItem.icon"
              :items="availableIcons"
              label="Icono"
              required
            >
              <template v-slot:item="{ item }">
                <v-icon :color="editedItem.color" class="mr-2">{{ item.title }}</v-icon>
                {{ item.title }}
              </template>
            </v-select>

            <v-color-picker
              v-model="editedItem.color"
              mode="hex"
              hide-inputs
              hide-canvas
              show-swatches
              swatches-max-height="200"
            ></v-color-picker>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="text"
            @click="showAddDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="saveCategory"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import PieChart from '@/components/PieChart.vue'

export default {
  name: 'CategoriesView',
  components: {
    PieChart
  },
  setup() {
    const showAddDialog = ref(false)
    const form = ref(null)

    const defaultItem = {
      name: '',
      icon: 'mdi-shape',
      color: '#1B4965'
    }

    const editedItem = ref({ ...defaultItem })
    
    const categories = ref([
      {
        id: 1,
        name: 'Comida',
        icon: 'mdi-food',
        color: '#1B4965',
        amount: 450
      },
      {
        id: 2,
        name: 'Transporte',
        icon: 'mdi-car',
        color: '#62B6CB',
        amount: 200
      },
      {
        id: 3,
        name: 'Entretenimiento',
        icon: 'mdi-movie',
        color: '#5FA8D3',
        amount: 150
      }
    ])

    const availableIcons = [
      { title: 'mdi-food', value: 'mdi-food' },
      { title: 'mdi-car', value: 'mdi-car' },
      { title: 'mdi-movie', value: 'mdi-movie' },
      { title: 'mdi-shopping', value: 'mdi-shopping' },
      { title: 'mdi-home', value: 'mdi-home' },
      { title: 'mdi-medical-bag', value: 'mdi-medical-bag' }
    ]

    const categoryDistribution = computed(() => {
      const distribution = {}
      categories.value.forEach(category => {
        distribution[category.name] = category.amount
      })
      return distribution
    })

    const editCategory = (item) => {
      editedItem.value = { ...item }
      showAddDialog.value = true
    }

    const deleteCategory = (item) => {
      const index = categories.value.indexOf(item)
      if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        categories.value.splice(index, 1)
      }
    }

    const saveCategory = () => {
      if (editedItem.value.id) {
        const index = categories.value.findIndex(item => item.id === editedItem.value.id)
        categories.value[index] = { ...editedItem.value }
      } else {
        categories.value.push({
          id: categories.value.length + 1,
          ...editedItem.value,
          amount: 0
        })
      }
      showAddDialog.value = false
      editedItem.value = { ...defaultItem }
    }

    return {
      showAddDialog,
      form,
      categories,
      editedItem,
      availableIcons,
      categoryDistribution,
      editCategory,
      deleteCategory,
      saveCategory
    }
  }
}
</script> 