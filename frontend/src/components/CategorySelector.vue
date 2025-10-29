<template>
  <div class="category-selector">
    <q-select
      v-model="selectedCategory"
      :options="categoryOptions"
      option-value="_id"
      option-label="name"
      emit-value
      map-options
      :label="label"
      :outlined="outlined"
      :filled="filled"
      :dense="dense"
      :disable="disable"
      :loading="loading"
      :clearable="clearable"
      :multiple="multiple"
      :use-chips="multiple"
      :rules="rules"
      @update:model-value="onSelectionChange"
      class="category-select"
    >
      <template v-slot:prepend>
        <q-icon name="category" />
      </template>

      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-avatar
              v-if="scope.opt.image"
              size="24px"
            >
              <img :src="scope.opt.image" :alt="scope.opt.name" />
            </q-avatar>
            <q-avatar
              v-else
              size="24px"
              color="primary"
              text-color="white"
            >
              {{ scope.opt.name.charAt(0).toUpperCase() }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <span :style="{ marginLeft: `${scope.opt.level * 16}px` }">
                {{ scope.opt.name }}
              </span>
            </q-item-label>
            <q-item-label caption>
              Nivel {{ scope.opt.level }}
              <span v-if="scope.opt.productCount !== undefined">
                • {{ scope.opt.productCount }} productos
              </span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-chip
              v-if="!scope.opt.isActive"
              size="sm"
              color="grey-5"
              text-color="grey-8"
              label="Inactiva"
            />
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:selected-item="scope">
        <q-chip
          removable
          dense
          @remove="scope.removeAtIndex(scope.index)"
          :tabindex="scope.tabindex"
          color="primary"
          text-color="white"
          class="q-ma-none"
        >
          <q-avatar>
            <img
              v-if="scope.opt.image"
              :src="scope.opt.image"
              :alt="scope.opt.name"
            />
            <span v-else>{{ scope.opt.name.charAt(0).toUpperCase() }}</span>
          </q-avatar>
          {{ scope.opt.name }}
        </q-chip>
      </template>

      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey-6">
            <div class="text-center">
              <q-icon name="category" size="2em" class="q-mb-sm" />
              <div>No hay categorías disponibles</div>
              <div class="text-caption">
                Crea algunas categorías primero
              </div>
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- Botón para crear nueva categoría -->
    <div v-if="showCreateButton" class="q-mt-sm">
      <q-btn
        flat
        dense
        size="sm"
        icon="add"
        label="Crear nueva categoría"
        color="primary"
        @click="$emit('create-category')"
        class="full-width"
      />
    </div>

    <!-- Jerarquía de la categoría seleccionada -->
    <div v-if="selectedCategoryPath.length > 0" class="q-mt-sm">
      <div class="text-caption text-grey-6 q-mb-xs">Jerarquía:</div>
      <div class="category-breadcrumb">
        <q-chip
          v-for="(pathItem, index) in selectedCategoryPath"
          :key="pathItem._id"
          size="sm"
          outline
          :color="index === selectedCategoryPath.length - 1 ? 'primary' : 'grey-5'"
          class="q-mr-xs q-mb-xs"
        >
          {{ pathItem.name }}
        </q-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useCategoryStore } from '../stores/categories';

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: null
  },
  label: {
    type: String,
    default: 'Categoría'
  },
  outlined: {
    type: Boolean,
    default: true
  },
  filled: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: () => []
  },
  showCreateButton: {
    type: Boolean,
    default: false
  },
  showInactiveCategories: {
    type: Boolean,
    default: false
  },
  maxLevel: {
    type: Number,
    default: 4
  }
});

const emit = defineEmits(['update:modelValue', 'create-category', 'selection-change']);

const categoryStore = useCategoryStore();
const selectedCategory = ref(props.modelValue);

// Computed
const loading = computed(() => categoryStore.loading);

const categoryOptions = computed(() => {
  let categories = categoryStore.categories || [];

  // Filtrar por estado activo si es necesario
  if (!props.showInactiveCategories) {
    categories = categories.filter(cat => cat.isActive);
  }

  // Filtrar por nivel máximo
  categories = categories.filter(cat => cat.level <= props.maxLevel);

  // Ordenar por path para mantener la jerarquía
  return categories.sort((a, b) => {
    if (a.path && b.path) {
      return a.path.localeCompare(b.path);
    }
    return a.name.localeCompare(b.name);
  });
});

const selectedCategoryPath = computed(() => {
  if (!selectedCategory.value) return [];

  if (props.multiple) {
    // Para selección múltiple, mostrar el path de la primera categoría
    const firstCategoryId = Array.isArray(selectedCategory.value)
      ? selectedCategory.value[0]
      : selectedCategory.value;
    return categoryStore.getCategoryPath(firstCategoryId);
  } else {
    return categoryStore.getCategoryPath(selectedCategory.value);
  }
});

// Métodos
const onSelectionChange = (value) => {
  selectedCategory.value = value;
  emit('update:modelValue', value);
  emit('selection-change', value);
};

// Watchers
watch(() => props.modelValue, (newValue) => {
  selectedCategory.value = newValue;
}, { immediate: true });

// Lifecycle
onMounted(async () => {
  // Cargar categorías si no están cargadas
  if (!categoryStore.categories.length) {
    try {
      await categoryStore.fetchCategories();
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }
});
</script>

<style scoped>
.category-selector {
  width: 100%;
}

.category-select :deep(.q-field__control) {
  border-radius: 8px;
}

.category-breadcrumb {
  max-height: 100px;
  overflow-y: auto;
}

.category-breadcrumb::-webkit-scrollbar {
  width: 4px;
}

.category-breadcrumb::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.category-breadcrumb::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}
</style>
