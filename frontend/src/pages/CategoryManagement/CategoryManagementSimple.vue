<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h4 text-weight-bold text-grey-8">
        <q-icon name="category" class="q-mr-sm" />
        Gestión de Categorías
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Nueva Categoría"
        unelevated
        class="q-px-lg"
      />
    </div>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">Sistema de Categorías</div>
        <p>Esta página está funcionando correctamente.</p>
        <p>Estado del store: {{ categoryStore.loading ? 'Cargando...' : 'Listo' }}</p>
        <p>Categorías cargadas: {{ categoryStore.categories.length }}</p>

        <q-btn
          color="primary"
          @click="loadCategories"
          :loading="categoryStore.loading"
        >
          Cargar Categorías
        </q-btn>

        <div v-if="categoryStore.categories.length > 0" class="q-mt-md">
          <div class="text-subtitle1">Categorías:</div>
          <ul>
            <li v-for="category in categoryStore.categories" :key="category._id">
              {{ category.name }} (Nivel {{ category.level }})
            </li>
          </ul>
        </div>

        <div v-if="categoryStore.error" class="text-negative q-mt-md">
          Error: {{ categoryStore.error }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCategoryStore } from '../../stores/categories';

const categoryStore = useCategoryStore();

const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories();
    console.log('Categorías cargadas:', categoryStore.categories);
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
};

// Lifecycle
onMounted(async () => {
  console.log('CategoryManagement mounted');
  await loadCategories();
});
</script>

<style scoped>
.q-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
