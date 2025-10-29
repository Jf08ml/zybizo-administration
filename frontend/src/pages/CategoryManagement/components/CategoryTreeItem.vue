<template>
  <div
    class="category-tree-item"
    :class="{ 'category-item-root': level === 0 }"
    :style="{ marginLeft: `${level * 20}px` }"
  >
    <!-- Categoría principal -->
    <q-card
      flat
      bordered
      class="q-mb-sm category-card"
      :class="{ 'q-ml-md': level > 0 }"
    >
      <q-card-section class="q-py-sm">
        <div class="row items-center no-wrap">
          <!-- Handle para drag & drop -->
          <q-icon
            name="drag_indicator"
            class="drag-handle text-grey-5 q-mr-sm cursor-pointer"
            size="sm"
          />

          <!-- Icono de expansión si tiene hijos -->
          <q-btn
            v-if="hasChildren"
            flat
            dense
            round
            size="sm"
            :icon="expanded ? 'expand_less' : 'expand_more'"
            @click="expanded = !expanded"
            class="q-mr-sm"
          />
          <div v-else class="q-mr-sm" style="width: 32px;"></div>

          <!-- Información de la categoría -->
          <div class="col">
            <div class="row items-center no-wrap">
              <q-avatar
                v-if="category.image"
                size="32px"
                class="q-mr-sm"
              >
                <img :src="category.image" :alt="category.name" />
              </q-avatar>
              <q-avatar
                v-else
                size="32px"
                color="primary"
                text-color="white"
                class="q-mr-sm"
              >
                {{ category.name.charAt(0).toUpperCase() }}
              </q-avatar>

              <div class="col">
                <div class="text-weight-medium">{{ category.name }}</div>
                <div class="text-caption text-grey-6">
                  Level {{ category.level }} •
                  {{ category.productCount || 0 }} productos
                  <span v-if="category.slug" class="q-ml-sm">
                    • /{{ category.slug }}
                  </span>
                </div>
              </div>

              <!-- Estado de la categoría -->
              <q-chip
                :color="category.isActive ? 'positive' : 'grey-5'"
                :text-color="category.isActive ? 'white' : 'grey-8'"
                size="sm"
                class="q-ml-sm"
              >
                {{ category.isActive ? 'Activa' : 'Inactiva' }}
              </q-chip>
            </div>

            <!-- Descripción si existe -->
            <div
              v-if="category.description"
              class="text-caption text-grey-7 q-mt-xs"
            >
              {{ category.description }}
            </div>
          </div>

          <!-- Acciones -->
          <div class="q-ml-sm">
            <q-btn-dropdown
              flat
              dense
              round
              icon="more_vert"
              size="sm"
              class="action-dropdown"
            >
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  @click="$emit('edit', category)"
                >
                  <q-item-section avatar>
                    <q-icon name="edit" />
                  </q-item-section>
                  <q-item-section>Editar</q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-close-popup
                  @click="$emit('create-child', category)"
                  :disabled="category.level >= 4"
                >
                  <q-item-section avatar>
                    <q-icon name="add" />
                  </q-item-section>
                  <q-item-section>Agregar Subcategoría</q-item-section>
                </q-item>

                <q-separator />

                <q-item
                  clickable
                  v-close-popup
                  @click="$emit('delete', category)"
                  class="text-negative"
                >
                  <q-item-section avatar>
                    <q-icon name="delete" />
                  </q-item-section>
                  <q-item-section>Eliminar</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Subcategorías (recursivas) -->
    <div v-if="hasChildren && expanded" class="children-container">
      <draggable
        v-model="localChildren"
        group="categories"
        item-key="_id"
        handle=".drag-handle"
        @end="onChildrenReorder"
      >
        <template #item="{ element: child }">
          <category-tree-item
            :category="child"
            :level="level + 1"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @create-child="$emit('create-child', $event)"
            @move="$emit('move', $event)"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { VueDraggableNext as draggable } from 'vue-draggable-next';

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['edit', 'delete', 'create-child', 'move']);

// Estado local
const expanded = ref(true);
const localChildren = ref([]);

// Computed
const hasChildren = computed(() => {
  return props.category.children && props.category.children.length > 0;
});

// Sincronizar children
watch(
  () => props.category.children,
  (newChildren) => {
    localChildren.value = [...(newChildren || [])];
  },
  { immediate: true, deep: true }
);

// Métodos
const onChildrenReorder = (event) => {
  const reorderedChildren = localChildren.value.map((child, index) => ({
    id: child._id,
    order: index,
    parent: props.category._id
  }));

  emit('move', {
    type: 'reorder',
    parent: props.category._id,
    children: reorderedChildren
  });
};
</script>

<style scoped>
.category-tree-item {
  position: relative;
}

.category-card {
  border-left: 3px solid var(--q-primary);
  transition: all 0.2s ease;
}

.category-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.category-item-root {
  margin-bottom: 8px;
}

.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.children-container {
  position: relative;
}

.children-container::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--q-separator-color);
}

.action-dropdown {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.category-card:hover .action-dropdown {
  opacity: 1;
}

/* Drag & Drop states */
.sortable-ghost {
  opacity: 0.5;
  background-color: var(--q-primary);
  border-radius: 4px;
}

.sortable-chosen {
  transform: rotate(2deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
