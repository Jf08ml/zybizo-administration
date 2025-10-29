import Product from "../models/product.js";
import Category from "../models/category.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError, ValidationError } = CustomErrors;

class ProductService {
  async createProduct(data) {
    try {
      // Validar categoría si se proporciona
      if (data.category) {
        const categoryExists = await Category.findById(data.category);
        if (!categoryExists) {
          ValidationError.throw("La categoría especificada no existe.");
        }
      }
      
      // Sincronizar stock con quantity
      if (data.quantity !== undefined) {
        data.stock = data.quantity;
      }
      
      const newProduct = new Product(data);
      const savedProduct = await newProduct.save();
      
      // Poblar la categoría en la respuesta
      return await Product.findById(savedProduct._id).populate('category');
    } catch (error) {
      console.error("Error en createProduct:", error);
      if (error.code === 11000) {
        ValidationError.throw("El SKU ya existe.");
      }
      DatabaseError.throw("Error al crear el producto.");
    }
  }

  async getProducts(filters = {}, options = {}) {
    try {
      const {
        page,
        limit = 50,
        sort = { uploadData: -1 },
        populate = ['category']
      } = options;

      let query = Product.find(filters);
      
      // Aplicar población
      if (populate.includes('category')) {
        query = query.populate('category', 'name slug color icon');
      }
      if (populate.includes('createdBy')) {
        query = query.populate('createdBy', 'name email');
      }
      if (populate.includes('updatedBy')) {
        query = query.populate('updatedBy', 'name email');
      }
      
      // Aplicar ordenamiento
      query = query.sort(sort);
      
      // Paginación si se requiere
      if (page && limit) {
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        
        const total = await Product.countDocuments(filters);
        const products = await query;
        
        return {
          data: products,
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
      console.error("Error en getProducts:", error);
      DatabaseError.throw("Error al obtener los productos.");
    }
  }

  async getProduct(id) {
    try {
      const product = await Product.findById(id)
        .populate('category', 'name slug color icon path')
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');
        
      if (!product) {
        NotFoundError.throw("Producto no encontrado.");
      }
      return product;
    } catch (error) {
      console.error("Error en getProduct:", error);
      if (error.name === 'CastError') {
        NotFoundError.throw("ID de producto inválido.");
      }
      DatabaseError.throw("Error al obtener el producto.");
    }
  }

  async updateProduct(productId, updateData) {
    try {
      // Validar categoría si se proporciona
      if (updateData.category) {
        const categoryExists = await Category.findById(updateData.category);
        if (!categoryExists) {
          ValidationError.throw("La categoría especificada no existe.");
        }
      }
      
      // Sincronizar stock con quantity
      if (updateData.quantity !== undefined) {
        updateData.stock = updateData.quantity;
      }
      
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { 
          new: true, 
          runValidators: true,
          populate: [
            { path: 'category', select: 'name slug color icon' },
            { path: 'createdBy', select: 'name email' },
            { path: 'updatedBy', select: 'name email' }
          ]
        }
      );
      
      if (!updatedProduct) {
        NotFoundError.throw("Producto no encontrado para actualizar.");
      }
      return updatedProduct;
    } catch (error) {
      console.error("Error en updateProduct:", error);
      if (error.code === 11000) {
        ValidationError.throw("El SKU ya existe.");
      }
      DatabaseError.throw("Error al actualizar el producto.");
    }
  }

  async updateStock(productId, quantity, operation = 'set') {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        NotFoundError.throw("Producto no encontrado.");
      }

      const updatedProduct = await product.updateStock(quantity, operation);
      return await Product.findById(updatedProduct._id).populate('category');
    } catch (error) {
      console.error("Error en updateStock:", error);
      DatabaseError.throw("Error al actualizar el stock.");
    }
  }

  async deleteProduct(productId) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        NotFoundError.throw("Producto no encontrado para eliminar.");
      }
      return deletedProduct;
    } catch (error) {
      console.error("Error en deleteProduct:", error);
      DatabaseError.throw("Error al eliminar el producto.");
    }
  }

  async getProductStats() {
    try {
      const stats = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            activeProducts: {
              $sum: { $cond: [{ $eq: ["$isActiveInCatalog", true] }, 1, 0] }
            },
            totalValue: { $sum: "$salePrice" },
            avgPrice: { $avg: "$salePrice" },
            lowStockCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $lte: ["$stock", "$minStock"] },
                      { $gt: ["$stock", 0] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            outOfStockCount: {
              $sum: { $cond: [{ $lte: ["$stock", 0] }, 1, 0] }
            }
          }
        }
      ]);

      // Estadísticas por categoría
      const categoryStats = await Product.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo"
          }
        },
        {
          $group: {
            _id: "$category",
            categoryName: { $first: { $arrayElemAt: ["$categoryInfo.name", 0] } },
            count: { $sum: 1 },
            avgPrice: { $avg: "$salePrice" },
            totalValue: { $sum: "$salePrice" }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return {
        overview: stats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          totalValue: 0,
          avgPrice: 0,
          lowStockCount: 0,
          outOfStockCount: 0
        },
        categoryBreakdown: categoryStats
      };
    } catch (error) {
      console.error("Error en getProductStats:", error);
      DatabaseError.throw("Error al obtener estadísticas.");
    }
  }

  async getLowStockProducts() {
    try {
      return await Product.findLowStock().populate('category', 'name slug color');
    } catch (error) {
      console.error("Error en getLowStockProducts:", error);
      DatabaseError.throw("Error al obtener productos con stock bajo.");
    }
  }

  async getProductsByCategory(categoryId) {
    try {
      return await Product.findByCategory(categoryId);
    } catch (error) {
      console.error("Error en getProductsByCategory:", error);
      DatabaseError.throw("Error al obtener productos por categoría.");
    }
  }

  async searchProducts(searchTerm, filters = {}) {
    try {
      const searchRegex = new RegExp(searchTerm, 'i');
      
      const searchFilters = {
        ...filters,
        $or: [
          { name: searchRegex },
          { namePublic: searchRegex },
          { description: searchRegex },
          { characteristics: searchRegex },
          { sku: searchRegex }
        ]
      };

      return await Product.find(searchFilters)
        .populate('category', 'name slug color')
        .sort({ uploadData: -1 })
        .limit(20);
    } catch (error) {
      console.error("Error en searchProducts:", error);
      DatabaseError.throw("Error en la búsqueda de productos.");
    }
  }
}

export default new ProductService();
