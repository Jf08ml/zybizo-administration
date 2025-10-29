import CategoryService from "../services/category.service.js";
import sendResponse from "../utils/response.js";

async function createCategory(req, res, next) {
  try {
    console.log('CategoryController: createCategory called with body:', req.body);
    const categoryData = req.body;
    
    // Añadir información del usuario si está disponible
    if (req.user?.id) {
      categoryData.createdBy = req.user.id;
      categoryData.updatedBy = req.user.id;
    }
    
    console.log('CategoryController: calling CategoryService.createCategory with:', categoryData);
    const newCategory = await CategoryService.createCategory(categoryData);
    console.log('CategoryController: category created successfully:', newCategory);
    sendResponse(res, 201, newCategory, "Categoría creada exitosamente.");
  } catch (error) {
    console.error('CategoryController: error creating category:', error);
    next(error);
  }
}

async function getCategories(req, res, next) {
  try {
    const { 
      includeInactive = false,
      parent,
      level,
      tree = false
    } = req.query;

    let categories;
    
    if (tree === 'true') {
      categories = await CategoryService.getCategoryTree();
    } else {
      const filters = {};
      
      if (includeInactive !== 'true') {
        filters.isActive = true;
      }
      
      if (parent !== undefined) {
        filters.parent = parent === 'null' ? null : parent;
      }
      
      if (level !== undefined) {
        filters.level = parseInt(level);
      }
      
      categories = await CategoryService.getCategories(filters);
    }
    
    sendResponse(
      res,
      200,
      categories,
      categories.length > 0 ? "Categorías encontradas." : "No se encontraron categorías."
    );
  } catch (error) {
    next(error);
  }
}

async function getCategory(req, res, next) {
  try {
    const category = await CategoryService.getCategory(req.params.id);
    sendResponse(res, 200, category, "Categoría encontrada.");
  } catch (error) {
    next(error);
  }
}

async function getCategoryBySlug(req, res, next) {
  try {
    const category = await CategoryService.getCategoryBySlug(req.params.slug);
    sendResponse(res, 200, category, "Categoría encontrada.");
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const updateData = req.body;
    
    // Añadir información del usuario si está disponible
    if (req.user?.id) {
      updateData.updatedBy = req.user.id;
    }
    
    const updatedCategory = await CategoryService.updateCategory(
      req.params.id,
      updateData
    );
    sendResponse(res, 200, updatedCategory, "Categoría actualizada con éxito.");
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await CategoryService.deleteCategory(req.params.id);
    sendResponse(res, 200, null, "Categoría eliminada con éxito.");
  } catch (error) {
    next(error);
  }
}

async function getCategoryHierarchy(req, res, next) {
  try {
    const hierarchy = await CategoryService.getCategoryHierarchy(req.params.id);
    sendResponse(res, 200, hierarchy, "Jerarquía de categoría obtenida.");
  } catch (error) {
    next(error);
  }
}

async function reorderCategories(req, res, next) {
  try {
    const { categories } = req.body; // Array de { id, sortOrder }
    
    const result = await CategoryService.reorderCategories(categories);
    sendResponse(res, 200, result, "Categorías reordenadas con éxito.");
  } catch (error) {
    next(error);
  }
}

async function getCategoryStats(req, res, next) {
  try {
    const stats = await CategoryService.getCategoryStats();
    sendResponse(res, 200, stats, "Estadísticas de categorías obtenidas.");
  } catch (error) {
    next(error);
  }
}

export {
  createCategory,
  getCategories,
  getCategory,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoryHierarchy,
  reorderCategories,
  getCategoryStats
};