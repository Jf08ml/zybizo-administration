import api from './api';

export const getCategories = async (params = {}) => {
  try {
    console.log('Service: fetching categories with params:', params);
    const response = await api.get('/categories', { params });
    console.log('Service: received response:', response);
    return response.data;
  } catch (error) {
    console.error('Service: error fetching categories:', error);
    throw error;
  }
};

export const getCategoryTree = async () => {
  const response = await api.get('/categories', {
    params: { tree: true }
  });
  return response.data;
};

export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/categories/slug/${slug}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export const getCategoryHierarchy = async (id) => {
  const response = await api.get(`/categories/${id}/hierarchy`);
  return response.data;
};

export const reorderCategories = async (categories) => {
  const response = await api.patch('/categories/reorder', { categories });
  return response.data;
};

export const getCategoryStats = async () => {
  const response = await api.get('/categories-stats');
  return response.data;
};

export const getRootCategories = async () => {
  const response = await api.get('/categories', {
    params: { parent: 'null' }
  });
  return response.data;
};
