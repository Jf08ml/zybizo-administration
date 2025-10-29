import Category from "../models/category.js";
import Product from "../models/product.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError, ValidationError } = CustomErrors;

class CategoryService {
  async createCategory(data) {
    try {
      console.log('CategoryService: createCategory called with data:', data);
      
      // Generar slug si no se proporciona
      if (!data.slug && data.name) {
        data.slug = this.generateSlug(data.name);
        console.log('CategoryService: generated slug:', data.slug);
      }
      
      // Validar que no exista una categoría con el mismo slug
      if (data.slug) {
        const existing = await Category.findOne({ slug: data.slug });
        if (existing) {
          ValidationError.throw("Ya existe una categoría con ese slug.");
        }
      }
      
      // Validar jerarquía
      if (data.parent) {
        const parent = await Category.findById(data.parent);
        if (!parent) {
          NotFoundError.throw("Categoría padre no encontrada.");
        }
        if (parent.level >= 4) { // Máximo 5 niveles (0-4)
          ValidationError.throw("No se pueden crear más de 5 niveles de categorías.");
        }
      }
      
      const newCategory = new Category(data);
      await newCategory.save();
      
      return newCategory.populate('parent');
    } catch (error) {
      console.error("Error en createCategory:", error);
      if (error.code === 11000) {
        ValidationError.throw("Ya existe una categoría con ese nombre o slug.");
      }
      DatabaseError.throw("Error al crear la categoría.");
    }
  }

  async getCategories(filters = {}, options = {}) {
    try {
      const {
        page,
        limit = 50,
        sort = { sortOrder: 1, name: 1 },
        populate = ['parent', 'children']
      } = options;

      let query = Category.find(filters);
      
      // Aplicar población
      if (populate.includes('parent')) {
        query = query.populate('parent', 'name slug level');
      }
      if (populate.includes('children')) {
        query = query.populate('children', 'name slug level sortOrder isActive');
      }
      if (populate.includes('productCount')) {
        query = query.populate('productCount');
      }
      
      // Aplicar ordenamiento
      query = query.sort(sort);
      
      // Paginación si se requiere
      if (page && limit) {
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        
        const total = await Category.countDocuments(filters);
        const categories = await query;
        
        return {
          data: categories,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
          }
        };
      }
      
      return await query;
    } catch (error) {
      console.error("Error en getCategories:", error);
      DatabaseError.throw("Error al obtener las categorías.");
    }
  }

  async getCategory(id) {
    try {
      const category = await Category.findById(id)
        .populate('parent', 'name slug level')
        .populate('children', 'name slug level sortOrder isActive')
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');
        
      if (!category) {
        NotFoundError.throw("Categoría no encontrada.");
      }
      
      return category;
    } catch (error) {
      console.error("Error en getCategory:", error);
      if (error.name === 'CastError') {
        NotFoundError.throw("ID de categoría inválido.");
      }
      DatabaseError.throw("Error al obtener la categoría.");
    }
  }

  async getCategoryBySlug(slug) {
    try {
      const category = await Category.findOne({ slug, isActive: true })
        .populate('parent', 'name slug level')
        .populate('children', 'name slug level sortOrder isActive');
        
      if (!category) {
        NotFoundError.throw("Categoría no encontrada.");
      }
      
      return category;
    } catch (error) {
      console.error("Error en getCategoryBySlug:", error);
      DatabaseError.throw("Error al obtener la categoría.");
    }
  }

  async updateCategory(categoryId, updateData) {
    try {
      // Validar que no exista otra categoría con el mismo slug
      if (updateData.slug) {
        const existing = await Category.findOne({ 
          slug: updateData.slug, 
          _id: { $ne: categoryId } 
        });
        if (existing) {
          ValidationError.throw("Ya existe una categoría con ese slug.");
        }
      }
      
      // Validar cambio de padre para evitar referencias circulares
      if (updateData.parent) {
        const isCircular = await this.checkCircularReference(categoryId, updateData.parent);
        if (isCircular) {
          ValidationError.throw("No se puede crear una referencia circular.");
        }
      }
      
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        updateData,
        { 
          new: true, 
          runValidators: true,
          populate: [
            { path: 'parent', select: 'name slug level' },
            { path: 'children', select: 'name slug level sortOrder isActive' }
          ]
        }
      );
      
      if (!updatedCategory) {
        NotFoundError.throw("Categoría no encontrada para actualizar.");
      }
      
      return updatedCategory;
    } catch (error) {
      console.error("Error en updateCategory:", error);
      if (error.code === 11000) {
        ValidationError.throw("Ya existe una categoría con ese nombre o slug.");
      }
      DatabaseError.throw("Error al actualizar la categoría.");
    }
  }

  async deleteCategory(categoryId) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        NotFoundError.throw("Categoría no encontrada.");
      }
      
      // Verificar si tiene productos asociados
      const productCount = await Product.countDocuments({ category: categoryId });
      if (productCount > 0) {
        ValidationError.throw(`No se puede eliminar la categoría porque tiene ${productCount} producto(s) asociado(s).`);
      }
      
      // Verificar si tiene subcategorías
      const childrenCount = await Category.countDocuments({ parent: categoryId });
      if (childrenCount > 0) {
        ValidationError.throw(`No se puede eliminar la categoría porque tiene ${childrenCount} subcategoría(s).`);
      }
      
      await Category.findByIdAndDelete(categoryId);
      return true;
    } catch (error) {
      console.error("Error en deleteCategory:", error);
      DatabaseError.throw("Error al eliminar la categoría.");
    }
  }

  async getCategoryTree(parentId = null) {
    try {
      const categories = await Category.find({ 
        parent: parentId, 
        isActive: true 
      })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
      
      // Recursivamente obtener hijos
      for (let category of categories) {
        category.children = await this.getCategoryTree(category._id);
        
        // Obtener conteo de productos
        category.productCount = await Product.countDocuments({ 
          category: category._id,
          isActive: true 
        });
      }
      
      return categories;
    } catch (error) {
      console.error("Error en getCategoryTree:", error);
      DatabaseError.throw("Error al obtener el árbol de categorías.");
    }
  }

  async getCategoryHierarchy(categoryId) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        NotFoundError.throw("Categoría no encontrada.");
      }
      
      return await category.getHierarchy();
    } catch (error) {
      console.error("Error en getCategoryHierarchy:", error);
      DatabaseError.throw("Error al obtener la jerarquía de la categoría.");
    }
  }

  async reorderCategories(categories) {
    try {
      const updates = categories.map(cat => ({
        updateOne: {
          filter: { _id: cat.id },
          update: { sortOrder: cat.sortOrder }
        }
      }));
      
      const result = await Category.bulkWrite(updates);
      return result;
    } catch (error) {
      console.error("Error en reorderCategories:", error);
      DatabaseError.throw("Error al reordenar categorías.");
    }
  }

  async getCategoryStats() {
    try {
      const totalCategories = await Category.countDocuments();
      const activeCategories = await Category.countDocuments({ isActive: true });
      const rootCategories = await Category.countDocuments({ parent: null });
      
      // Estadísticas por nivel
      const levelStats = await Category.aggregate([
        { $group: { _id: "$level", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // Categorías con más productos
      const categoriesWithProducts = await Category.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "category",
            as: "products"
          }
        },
        {
          $project: {
            name: 1,
            slug: 1,
            productCount: { $size: "$products" }
          }
        },
        { $sort: { productCount: -1 } },
        { $limit: 10 }
      ]);
      
      return {
        overview: {
          total: totalCategories,
          active: activeCategories,
          inactive: totalCategories - activeCategories,
          root: rootCategories
        },
        levelBreakdown: levelStats,
        topCategories: categoriesWithProducts
      };
    } catch (error) {
      console.error("Error en getCategoryStats:", error);
      DatabaseError.throw("Error al obtener estadísticas de categorías.");
    }
  }

  async checkCircularReference(categoryId, parentId) {
    try {
      if (categoryId.toString() === parentId.toString()) {
        return true;
      }
      
      const parent = await Category.findById(parentId);
      if (!parent || !parent.parent) {
        return false;
      }
      
      return await this.checkCircularReference(categoryId, parent.parent);
    } catch (error) {
      return false;
    }
  }

  async getRootCategories() {
    try {
      return await Category.getRootCategories();
    } catch (error) {
      console.error("Error en getRootCategories:", error);
      DatabaseError.throw("Error al obtener categorías raíz.");
    }
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .normalize('NFD') // Normalizar caracteres Unicode
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos y diacríticos
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno solo
      .replace(/^-+|-+$/g, ''); // Remover guiones al inicio/final
  }
}

export default new CategoryService();