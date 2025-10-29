import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as categoryService from '../services/categoryService';

export const useCategoryStore = defineStore('categories', () => {
  // Estado
  const categories = ref([]);
  const categoryTree = ref([]);
  const currentCategory = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters computados
  const rootCategories = computed(() => {
    return categories.value.filter(cat => !cat.parent);
  });

  const getCategoryById = computed(() => {
    return (id) => categories.value.find(cat => cat._id === id);
  });

  const getCategoryChildren = computed(() => {
    return (parentId) => categories.value.filter(cat => cat.parent === parentId);
  });

  const getCategoryPath = computed(() => {
    return (categoryId) => {
      const category = getCategoryById.value(categoryId);
      if (!category) return [];

      const path = [];
      let current = category;

      while (current) {
        path.unshift(current);
        current = getCategoryById.value(current.parent);
      }

      return path;
    };
  });

  // Acciones
  const fetchCategories = async (params = {}) => {
    try {
      loading.value = true;
      error.value = null;
      console.log('Store: fetching categories with params:', params);
      const data = await categoryService.getCategories(params);
      console.log('Store: received data:', data);
      // La API retorna { status, data, message }
      categories.value = data.data || data.categories || data || [];
      console.log('Store: categories set to:', categories.value);
      return data;
    } catch (err) {
      console.error('Store: error fetching categories:', err);
      error.value = err.response?.data?.message || 'Error al cargar categorías';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchCategoryTree = async () => {
    try {
      loading.value = true;
      error.value = null;
      const data = await categoryService.getCategoryTree();
      categoryTree.value = data.data || data.categories || data || [];
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar árbol de categorías';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchCategory = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await categoryService.getCategory(id);
      currentCategory.value = data.category || data;
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar categoría';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (categoryData) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await categoryService.createCategory(categoryData);

      // Actualizar lista local
      categories.value.push(data.category || data);

      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al crear categoría';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await categoryService.updateCategory(id, categoryData);

      // Actualizar en lista local
      const index = categories.value.findIndex(cat => cat._id === id);
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...data.category };
      }

      // Actualizar categoría actual si es la misma
      if (currentCategory.value?._id === id) {
        currentCategory.value = { ...currentCategory.value, ...data.category };
      }

      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar categoría';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      await categoryService.deleteCategory(id);

      // Remover de lista local
      categories.value = categories.value.filter(cat => cat._id !== id);

      // Limpiar categoría actual si es la misma
      if (currentCategory.value?._id === id) {
        currentCategory.value = null;
      }

    } catch (err) {
      error.value = err.response?.data?.message || 'Error al eliminar categoría';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reorderCategories = async (categoriesOrder) => {
    try {
      loading.value = true;
      error.value = null;
      await categoryService.reorderCategories(categoriesOrder);

      // Recargar categorías después del reordenamiento
      await fetchCategories();

    } catch (err) {
      error.value = err.response?.data?.message || 'Error al reordenar categorías';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const clearCurrentCategory = () => {
    currentCategory.value = null;
  };

  // Función para construir árbol de categorías localmente
  const buildCategoryTree = (parentId = null) => {
    return categories.value
      .filter(cat => cat.parent === parentId)
      .map(cat => ({
        ...cat,
        children: buildCategoryTree(cat._id)
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  return {
    // Estado
    categories,
    categoryTree,
    currentCategory,
    loading,
    error,

    // Getters
    rootCategories,
    getCategoryById,
    getCategoryChildren,
    getCategoryPath,

    // Acciones
    fetchCategories,
    fetchCategoryTree,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    clearError,
    clearCurrentCategory,
    buildCategoryTree
  };
});
