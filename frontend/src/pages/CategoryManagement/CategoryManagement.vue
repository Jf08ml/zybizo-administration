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
        @click="showCreateDialog = true"
        unelevated
        class="q-px-lg"
      />
    </div>

    <!-- Filtros y búsqueda -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md items-end">
          <q-input
            v-model="searchQuery"
            outlined
            placeholder="Buscar categorías..."
            dense
            style="min-width: 300px"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="viewMode"
            :options="viewModeOptions"
            outlined
            dense
            emit-value
            map-options
            label="Vista"
            style="min-width: 120px"
          />

          <q-btn
            flat
            icon="refresh"
            @click="refreshCategories"
            :loading="categoryStore.loading"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Vista de lista simplificada -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">Lista de Categorías</div>

        <div v-if="categoryStore.loading" class="text-center q-py-xl">
          <q-spinner-gears size="50px" color="primary" />
          <div class="q-mt-md">Cargando categorías...</div>
        </div>

        <div v-else-if="categoryStore.error" class="text-center text-negative q-py-xl">
          <q-icon name="error" size="3em" class="q-mb-md" />
          <div class="text-h6">Error al cargar categorías</div>
          <div>{{ categoryStore.error }}</div>
          <q-btn
            flat
            color="primary"
            @click="refreshCategories"
            class="q-mt-md"
          >
            Reintentar
          </q-btn>
        </div>

        <div v-else-if="filteredCategories.length === 0" class="text-center text-grey-6 q-py-xl">
          <q-icon name="category" size="3em" class="q-mb-md" />
          <div class="text-h6">No hay categorías</div>
          <div>Crea tu primera categoría para comenzar</div>
        </div>        <div v-else>
          <q-list separator>
            <q-item
              v-for="category in filteredCategories"
              :key="category._id || Math.random()"
              class="q-pa-md"
            >
              <q-item-section avatar>
                <q-avatar
                  v-if="category.image"
                  size="40px"
                >
                  <img :src="category.image" :alt="category.name || 'Categoría'" />
                </q-avatar>
                <q-avatar
                  v-else
                  size="40px"
                  color="primary"
                  text-color="white"
                >
                  {{ (category.name || 'C').charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">{{ category.name || 'Sin nombre' }}</q-item-label>
                <q-item-label caption>
                  {{ category.description || 'Sin descripción' }}
                </q-item-label>
                <q-item-label caption>
                  Nivel {{ category.level || 0 }} • Slug: /{{ category.slug || 'sin-slug' }}
                </q-item-label>
              </q-item-section>              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-chip
                    :color="category.isActive ? 'positive' : 'grey-5'"
                    :text-color="category.isActive ? 'white' : 'grey-8'"
                    size="sm"
                  >
                    {{ category.isActive ? 'Activa' : 'Inactiva' }}
                  </q-chip>

                  <q-btn
                    flat
                    dense
                    round
                    icon="edit"
                    size="sm"
                    color="primary"
                    @click="editCategory(category)"
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
                    @click="confirmDelete(category)"
                  >
                    <q-tooltip>Eliminar</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dialog para crear/editar categoría -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section>
          <div class="text-h6">{{ selectedCategory ? 'Editar' : 'Nueva' }} Categoría</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-gutter-md">
            <!-- Nombre -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="categoryForm.name"
                label="Nombre *"
                outlined
                :rules="[
                  val => !!val || 'El nombre es requerido',
                  val => val.length >= 2 || 'Mínimo 2 caracteres',
                  val => val.length <= 100 || 'Máximo 100 caracteres'
                ]"
                maxlength="100"
                counter
              />
            </div>

            <!-- Slug -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="categoryForm.slug"
                label="Slug (URL amigable)"
                outlined
                hint="Se genera automáticamente si se deja vacío"
                :rules="[
                  val => !val || /^[a-z0-9-]+$/.test(val) || 'Solo letras minúsculas, números y guiones'
                ]"
              />
            </div>

            <!-- Descripción -->
            <div class="col-12">
              <q-input
                v-model="categoryForm.description"
                label="Descripción"
                outlined
                type="textarea"
                rows="3"
                maxlength="500"
                counter
                hint="Descripción opcional de la categoría"
              />
            </div>

            <!-- Categoría padre -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="categoryForm.parent"
                :options="parentOptions"
                option-value="_id"
                option-label="name"
                emit-value
                map-options
                label="Categoría padre (opcional)"
                outlined
                clearable
                :disable="isEditing"
                hint="Selecciona una categoría padre para crear una subcategoría"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon :name="scope.opt.icon || 'category'" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.name }}</q-item-label>
                      <q-item-label caption>Nivel {{ scope.opt.level }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Estados -->
            <div class="col-12">
              <div class="text-subtitle2 q-mb-sm">Configuración</div>
              <div class="row q-gutter-md">
                <q-toggle
                  v-model="categoryForm.isActive"
                  label="Categoría activa"
                  color="positive"
                />
                <q-toggle
                  v-model="categoryForm.isVisibleInMenu"
                  label="Visible en menú"
                  color="primary"
                />
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                Las categorías inactivas no serán visibles en el frontend.
                Las categorías ocultas del menú no aparecerán en la navegación principal.
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" @click="cancelCategoryDialog" />
          <q-btn
            flat
            label="Limpiar"
            color="orange"
            @click="resetForm"
            class="q-mr-sm"
          />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="handleSaveCategory"
            :loading="categoryStore.loading"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>    <!-- Dialog para confirmar eliminación -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Confirmar Eliminación</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          ¿Estás seguro de que deseas eliminar la categoría
          <strong>{{ categoryToDelete?.name }}</strong>?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showDeleteDialog = false" />
          <q-btn
            flat
            label="Eliminar"
            color="negative"
            @click="handleDeleteCategory"
            :loading="categoryStore.loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useCategoryStore } from '../../stores/categories';

const $q = useQuasar();
const categoryStore = useCategoryStore();

// Estado reactivo
const searchQuery = ref('');
const viewMode = ref('list');
const showCreateDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedCategory = ref(null);
const categoryToDelete = ref(null);

const categoryForm = ref({
  name: '',
  slug: '',
  description: '',
  parent: null,
  isActive: true,
  isVisibleInMenu: true
});

const viewModeOptions = [
  { label: 'Lista', value: 'list' }
];

// Computed
const filteredCategories = computed(() => {
  console.log('Computing filteredCategories:', categoryStore.categories);

  const categories = categoryStore.categories || [];

  if (!searchQuery.value) {
    return categories;
  }

  const query = searchQuery.value.toLowerCase();
  return categories.filter(category => {
    if (!category) return false;

    const name = category.name || '';
    const description = category.description || '';
    const slug = category.slug || '';

    return name.toLowerCase().includes(query) ||
           description.toLowerCase().includes(query) ||
           slug.toLowerCase().includes(query);
  });
});

const parentOptions = computed(() => {
  const categories = categoryStore.categories || [];

  // Para categorías en edición, evitar crear relaciones circulares
  const availableCategories = categories.filter(cat => {
    if (selectedCategory.value && cat._id === selectedCategory.value._id) {
      return false;
    }
    // Solo mostrar categorías hasta nivel 3 como padres (el máximo nivel es 4)
    return cat.level < 4;
  });

  return [
    { _id: null, name: 'Sin categoría padre (Nivel raíz)', level: -1 },
    ...availableCategories.map(cat => ({
      ...cat,
      displayName: `${'  '.repeat(cat.level || 0)}${cat.name} (Nivel ${cat.level || 0})`
    }))
  ];
});

// Métodos
const refreshCategories = async () => {
  try {
    console.log('Fetching categories...');
    await categoryStore.fetchCategories();
    console.log('Categories fetched:', categoryStore.categories);
    $q.notify({
      type: 'positive',
      message: 'Categorías actualizadas correctamente'
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar categorías: ' + (error.message || error)
    });
  }
};

const editCategory = (category) => {
  selectedCategory.value = { ...category };
  categoryForm.value = {
    name: category.name || '',
    slug: category.slug || '',
    description: category.description || '',
    parent: category.parent || null,
    isActive: category.isActive !== undefined ? category.isActive : true,
    isVisibleInMenu: category.isVisibleInMenu !== undefined ? category.isVisibleInMenu : true
  };
  showCreateDialog.value = true;
};

const confirmDelete = (category) => {
  categoryToDelete.value = category;
  showDeleteDialog.value = true;
};

const resetForm = () => {
  selectedCategory.value = null;
  categoryForm.value = {
    name: '',
    slug: '',
    description: '',
    parent: null,
    isActive: true,
    isVisibleInMenu: true
  };
};

const generateSlug = () => {
  if (categoryForm.value.name) {
    categoryForm.value.slug = categoryForm.value.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
};

const handleSaveCategory = async () => {
  try {
    if (!categoryForm.value.name) {
      $q.notify({
        type: 'negative',
        message: 'El nombre es requerido'
      });
      return;
    }

    // Generar slug automáticamente si está vacío
    if (!categoryForm.value.slug) {
      generateSlug();
    }

    // Preparar datos para enviar
    const categoryData = {
      name: categoryForm.value.name,
      slug: categoryForm.value.slug,
      description: categoryForm.value.description,
      parent: categoryForm.value.parent,
      isActive: categoryForm.value.isActive,
      isVisibleInMenu: categoryForm.value.isVisibleInMenu
    };

    if (selectedCategory.value) {
      // Editar categoría existente
      await categoryStore.updateCategory(selectedCategory.value._id, categoryData);
      $q.notify({
        type: 'positive',
        message: 'Categoría actualizada correctamente'
      });
    } else {
      // Crear nueva categoría
      await categoryStore.createCategory(categoryData);
      $q.notify({
        type: 'positive',
        message: 'Categoría creada correctamente'
      });
    }

    showCreateDialog.value = false;
    resetForm();
    await refreshCategories();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Error al guardar categoría'
    });
  }
};

const handleDeleteCategory = async () => {
  try {
    await categoryStore.deleteCategory(categoryToDelete.value._id);
    $q.notify({
      type: 'positive',
      message: 'Categoría eliminada correctamente'
    });
    showDeleteDialog.value = false;
    await refreshCategories();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Error al eliminar categoría'
    });
  }
};

const cancelCategoryDialog = () => {
  showCreateDialog.value = false;
  resetForm();
};

// Watchers
watch(() => categoryForm.value.name, (newName) => {
  if (newName && !selectedCategory.value) {
    // Solo generar slug automáticamente para nuevas categorías
    generateSlug();
  }
});

// Lifecycle
onMounted(async () => {
  await refreshCategories();
});
</script>

<style scoped>
.q-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
