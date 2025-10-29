<template>
  <div class="category-list">
    <q-table
      :rows="categories"
      :columns="columns"
      row-key="_id"
      :pagination="pagination"
      :filter="filter"
      binary-state-sort
      flat
      bordered
      class="category-table"
    >
      <!-- Slot para el nombre con imagen -->
      <template v-slot:body-cell-name="props">
        <q-td :props="props" class="q-pa-md">
          <div class="row items-center no-wrap">
            <q-avatar
              v-if="props.row.image"
              size="40px"
              class="q-mr-md"
            >
              <img :src="props.row.image" :alt="props.row.name" />
            </q-avatar>
            <q-avatar
              v-else
              size="40px"
              color="primary"
              text-color="white"
              class="q-mr-md"
            >
              {{ props.row.name.charAt(0).toUpperCase() }}
            </q-avatar>

            <div>
              <div class="text-weight-medium">{{ props.row.name }}</div>
              <div class="text-caption text-grey-6">
                /{{ props.row.slug }}
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <!-- Slot para la jerarquía -->
      <template v-slot:body-cell-hierarchy="props">
        <q-td :props="props">
          <div class="hierarchy-path">
            <q-chip
              v-for="(pathItem, index) in getCategoryPath(props.row)"
              :key="pathItem._id"
              size="sm"
              outline
              :color="index === getCategoryPath(props.row).length - 1 ? 'primary' : 'grey-5'"
              class="q-mr-xs"
            >
              {{ pathItem.name }}
            </q-chip>
          </div>
        </q-td>
      </template>

      <!-- Slot para el nivel -->
      <template v-slot:body-cell-level="props">
        <q-td :props="props">
          <q-badge
            :color="getLevelColor(props.row.level)"
            :label="`Nivel ${props.row.level}`"
            class="q-pa-xs"
          />
        </q-td>
      </template>

      <!-- Slot para el estado -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.isActive ? 'positive' : 'grey-5'"
            :text-color="props.row.isActive ? 'white' : 'grey-8'"
            :icon="props.row.isActive ? 'check_circle' : 'cancel'"
            size="sm"
          >
            {{ props.row.isActive ? 'Activa' : 'Inactiva' }}
          </q-chip>
        </q-td>
      </template>

      <!-- Slot para productos -->
      <template v-slot:body-cell-products="props">
        <q-td :props="props">
          <div class="text-center">
            <div class="text-weight-medium">{{ props.row.productCount || 0 }}</div>
            <div class="text-caption text-grey-6">productos</div>
          </div>
        </q-td>
      </template>

      <!-- Slot para acciones -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="row no-wrap q-gutter-xs">
            <q-btn
              flat
              dense
              round
              icon="visibility"
              size="sm"
              color="info"
              @click="$emit('view-details', props.row)"
            >
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>

            <q-btn
              flat
              dense
              round
              icon="edit"
              size="sm"
              color="primary"
              @click="$emit('edit', props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>

            <q-btn
              flat
              dense
              round
              icon="delete"
              size="sm"
              color="negative"
              @click="$emit('delete', props.row)"
            >
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <!-- Slot para fila vacía -->
      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey-6 q-pa-xl">
          <div class="column items-center">
            <q-icon name="category" size="3em" class="q-mb-md" />
            <div class="text-h6">No se encontraron categorías</div>
            <div>Intenta ajustar los filtros de búsqueda</div>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCategoryStore } from '../../../stores/categories';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['edit', 'delete', 'view-details']);

const categoryStore = useCategoryStore();

// Configuración de la tabla
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'name',
  descending: false
});

const filter = ref('');

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: 'name',
    sortable: true,
    style: 'min-width: 200px'
  },
  {
    name: 'hierarchy',
    label: 'Jerarquía',
    align: 'left',
    field: 'path',
    style: 'min-width: 250px'
  },
  {
    name: 'level',
    label: 'Nivel',
    align: 'center',
    field: 'level',
    sortable: true,
    style: 'width: 100px'
  },
  {
    name: 'products',
    label: 'Productos',
    align: 'center',
    field: 'productCount',
    sortable: true,
    style: 'width: 120px'
  },
  {
    name: 'status',
    label: 'Estado',
    align: 'center',
    field: 'isActive',
    sortable: true,
    style: 'width: 120px'
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'center',
    style: 'width: 150px'
  }
];

// Métodos
const getCategoryPath = (category) => {
  return categoryStore.getCategoryPath(category._id);
};

const getLevelColor = (level) => {
  const colors = ['primary', 'secondary', 'accent', 'positive', 'warning'];
  return colors[level] || 'grey-5';
};
</script>

<style scoped>
.category-list {
  width: 100%;
}

.category-table {
  border-radius: 8px;
  overflow: hidden;
}

.category-table :deep(.q-table__top) {
  background-color: var(--q-primary);
  color: white;
}

.category-table :deep(.q-table thead th) {
  background-color: #f5f5f5;
  font-weight: 600;
  color: var(--q-dark);
}

.category-table :deep(.q-table tbody tr:hover) {
  background-color: var(--q-primary-container);
}

.hierarchy-path {
  max-width: 250px;
  overflow-x: auto;
  white-space: nowrap;
  padding: 4px 0;
}

.hierarchy-path::-webkit-scrollbar {
  height: 4px;
}

.hierarchy-path::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.hierarchy-path::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}
</style>
