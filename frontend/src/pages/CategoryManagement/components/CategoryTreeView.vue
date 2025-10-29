<template>
  <div class="category-tree">
    <div v-if="!categories || categories.length === 0" class="text-center text-grey-6 q-py-xl">
      <q-icon name="category" size="3em" class="q-mb-md" />
      <div class="text-h6">No hay categorías</div>
      <div>Crea tu primera categoría para comenzar</div>
    </div>

    <div v-else>
      <draggable
        v-model="localCategories"
        group="categories"
        item-key="_id"
        handle=".drag-handle"
        @end="onDragEnd"
        class="tree-container"
      >
        <template #item="{ element: category }">
          <category-tree-item
            :category="category"
            :level="0"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @create-child="$emit('create-child', $event)"
            @move="onMove"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { VueDraggableNext as draggable } from 'vue-draggable-next';
import CategoryTreeItem from './CategoryTreeItem.vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['edit', 'delete', 'create-child', 'reorder']);

// Estado local para el drag & drop
const localCategories = ref([]);

// Sincronizar con props
watch(
  () => props.categories,
  (newCategories) => {
    localCategories.value = [...(newCategories || [])];
  },
  { immediate: true, deep: true }
);

// Métodos
const onDragEnd = (event) => {
  // Emitir evento de reordenamiento con la nueva estructura
  const reorderedCategories = localCategories.value.map((cat, index) => ({
    id: cat._id,
    order: index,
    parent: cat.parent
  }));

  emit('reorder', reorderedCategories);
};

const onMove = (moveData) => {
  // Manejar movimiento entre niveles
  emit('reorder', moveData);
};
</script>

<style scoped>
.category-tree {
  min-height: 200px;
}

.tree-container {
  min-height: 100px;
}

.sortable-ghost {
  opacity: 0.5;
}

.sortable-chosen {
  background-color: var(--q-primary);
  color: white;
}
</style>
