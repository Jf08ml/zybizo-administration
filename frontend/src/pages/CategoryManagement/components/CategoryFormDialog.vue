<template>
  <q-card style="min-width: 600px; max-width: 800px">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">
        {{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}
      </div>
      <q-space />
      <q-btn icon="close" flat round dense @click="$emit('cancel')" />
    </q-card-section>

    <q-form @submit="handleSubmit" @reset="handleReset" class="q-gutter-md">
      <q-card-section>
        <div class="row q-gutter-md">
          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.name"
              label="Nombre de la categoría *"
              outlined
              :rules="[
                val => !!val || 'El nombre es requerido',
                val => val.length >= 2 || 'Mínimo 2 caracteres',
                val => val.length <= 50 || 'Máximo 50 caracteres'
              ]"
              maxlength="50"
              counter
              autofocus
            />
          </div>

          <!-- Slug -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.slug"
              label="Slug (URL amigable)"
              outlined
              :rules="[
                val => !val || /^[a-z0-9-]+$/.test(val) || 'Solo letras minúsculas, números y guiones'
              ]"
              hint="Se genera automáticamente si se deja vacío"
            />
          </div>

          <!-- Categoría padre -->
          <div class="col-12">
            <q-select
              v-model="form.parent"
              :options="parentOptions"
              option-value="_id"
              option-label="name"
              emit-value
              map-options
              label="Categoría padre (opcional)"
              outlined
              clearable
              :disable="!!parentCategory"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-avatar
                      v-if="scope.opt.image"
                      size="24px"
                    >
                      <img :src="scope.opt.image" />
                    </q-avatar>
                    <q-avatar
                      v-else
                      size="24px"
                      color="primary"
                      text-color="white"
                    >
                      {{ scope.opt.name.charAt(0) }}
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>Nivel {{ scope.opt.level }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <div v-if="parentCategory" class="text-caption text-info q-mt-xs">
              Se creará como subcategoría de: {{ parentCategory.name }}
            </div>
          </div>

          <!-- Descripción -->
          <div class="col-12">
            <q-input
              v-model="form.description"
              label="Descripción"
              outlined
              type="textarea"
              rows="3"
              maxlength="200"
              counter
              hint="Descripción opcional de la categoría"
            />
          </div>

          <!-- Imagen -->
          <div class="col-12">
            <div class="text-subtitle2 q-mb-sm">Imagen de la categoría</div>

            <!-- Preview de imagen actual -->
            <div v-if="imagePreview" class="q-mb-md">
              <q-img
                :src="imagePreview"
                style="height: 100px; width: 100px"
                class="rounded-borders"
                fit="cover"
              >
                <div class="absolute-top-right q-ma-xs">
                  <q-btn
                    round
                    dense
                    size="sm"
                    icon="close"
                    color="negative"
                    @click="removeImage"
                  />
                </div>
              </q-img>
            </div>

            <!-- Input de archivo -->
            <q-file
              v-model="imageFile"
              label="Seleccionar imagen"
              outlined
              accept="image/*"
              max-file-size="2097152"
              @update:model-value="onImageSelect"
              @rejected="onImageRejected"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
            </q-file>
            <div class="text-caption text-grey-6 q-mt-xs">
              Tamaño máximo: 2MB. Formatos: JPG, PNG, WebP
            </div>
          </div>

          <!-- Orden -->
          <div class="col-12 col-md-6">
            <q-input
              v-model.number="form.order"
              label="Orden"
              outlined
              type="number"
              min="0"
              hint="Orden de visualización (menor número = primera posición)"
            />
          </div>

          <!-- Estado activo -->
          <div class="col-12 col-md-6">
            <q-toggle
              v-model="form.isActive"
              label="Categoría activa"
              color="positive"
              class="q-mt-md"
            />
            <div class="text-caption text-grey-6">
              Las categorías inactivas no serán visibles en el frontend
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancelar"
          @click="$emit('cancel')"
          class="q-mr-sm"
        />
        <q-btn
          type="reset"
          flat
          label="Limpiar"
          color="orange"
          class="q-mr-sm"
        />
        <q-btn
          type="submit"
          :label="isEditing ? 'Actualizar' : 'Crear'"
          color="primary"
          :loading="loading"
          unelevated
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useCategoryStore } from '../../../stores/categories';

const props = defineProps({
  category: {
    type: Object,
    default: null
  },
  parentCategory: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save', 'cancel']);

const $q = useQuasar();
const categoryStore = useCategoryStore();

// Estado
const loading = ref(false);
const imageFile = ref(null);
const imagePreview = ref('');

// Formulario
const form = ref({
  name: '',
  slug: '',
  description: '',
  parent: null,
  image: '',
  order: 0,
  isActive: true
});

// Computed
const isEditing = computed(() => !!props.category);

const parentOptions = computed(() => {
  // Filtrar categorías que pueden ser padre
  return categoryStore.categories.filter(cat => {
    // No puede ser padre de sí misma
    if (props.category && cat._id === props.category._id) return false;

    // No puede tener más de 4 niveles
    if (cat.level >= 4) return false;

    // Si está editando, no puede ser hijo de sus propios descendientes
    if (props.category && isDescendant(cat, props.category)) return false;

    return true;
  });
});

// Métodos
const initializeForm = () => {
  if (props.category) {
    // Modo edición
    form.value = {
      name: props.category.name || '',
      slug: props.category.slug || '',
      description: props.category.description || '',
      parent: props.category.parent || null,
      image: props.category.image || '',
      order: props.category.order || 0,
      isActive: props.category.isActive !== undefined ? props.category.isActive : true
    };
    imagePreview.value = props.category.image || '';
  } else {
    // Modo creación
    form.value = {
      name: '',
      slug: '',
      description: '',
      parent: props.parentCategory?._id || null,
      image: '',
      order: 0,
      isActive: true
    };
    imagePreview.value = '';
  }

  imageFile.value = null;
};

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .trim('-'); // Remover guiones al inicio/final
};

const onImageSelect = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const onImageRejected = (rejectedEntries) => {
  const entry = rejectedEntries[0];
  if (entry.failedPropValidation === 'max-file-size') {
    $q.notify({
      type: 'negative',
      message: 'La imagen es demasiado grande. Máximo 2MB.'
    });
  } else {
    $q.notify({
      type: 'negative',
      message: 'Formato de imagen no válido.'
    });
  }
};

const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = '';
  form.value.image = '';
};

const isDescendant = (potentialParent, category) => {
  // Verificar si potentialParent es descendiente de category
  const children = categoryStore.getCategoryChildren(category._id);

  for (const child of children) {
    if (child._id === potentialParent._id) return true;
    if (isDescendant(potentialParent, child)) return true;
  }

  return false;
};

const handleSubmit = async () => {
  try {
    loading.value = true;

    const formData = { ...form.value };

    // Generar slug si no se proporcionó
    if (!formData.slug && formData.name) {
      formData.slug = generateSlug(formData.name);
    }

    // Manejar imagen si se seleccionó una nueva
    if (imageFile.value) {
      // Aquí puedes implementar la subida de imagen
      // Por ahora, usaremos el preview como placeholder
      formData.image = imagePreview.value;
    }

    emit('save', formData);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al procesar el formulario'
    });
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  initializeForm();
};

// Watchers
watch(() => form.value.name, (newName) => {
  // Auto-generar slug solo si no está editando o si el slug está vacío
  if (!isEditing.value || !form.value.slug) {
    if (newName) {
      form.value.slug = generateSlug(newName);
    }
  }
});

watch(() => props.category, () => {
  initializeForm();
}, { immediate: true });

watch(() => props.parentCategory, () => {
  if (props.parentCategory && !isEditing.value) {
    form.value.parent = props.parentCategory._id;
  }
}, { immediate: true });

// Lifecycle
onMounted(() => {
  initializeForm();
});
</script>

<style scoped>
.q-card {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
