import ProductService from "../services/product.service.js";
import sendResponse from "../utils/response.js";

async function createProduct(req, res, next) {
  try {
    const productData = req.body.product || req.body;
    
    // Añadir información del usuario si está disponible
    if (req.user?.id) {
      productData.createdBy = req.user.id;
      productData.updatedBy = req.user.id;
    }
    
    const newProduct = await ProductService.createProduct(productData);
    sendResponse(res, 201, newProduct, "Producto creado exitosamente.");
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const { 
      category, 
      search, 
      isActiveInCatalog,
      sortBy = 'uploadData',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
      includeLowStock,
      includeOutOfStock
    } = req.query;

    const filters = {};
    
    // Aplicar filtros
    if (category) filters.category = category;
    if (isActiveInCatalog !== undefined) filters.isActiveInCatalog = isActiveInCatalog === 'true';
    
    // Búsqueda
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { namePublic: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { characteristics: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtros de stock
    if (includeLowStock === 'only') {
      filters.$expr = { $lte: ["$stock", "$minStock"] };
      filters.stock = { $gt: 0 };
    } else if (includeOutOfStock === 'only') {
      filters.stock = { $lte: 0 };
    } else if (includeOutOfStock === 'false') {
      filters.stock = { $gt: 0 };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: ['category']
    };

    const products = await ProductService.getProducts(filters, options);
    
    sendResponse(
      res,
      200,
      products,
      products.data?.length > 0 || products.length > 0
        ? "Productos encontrados."
        : "No se encontraron productos."
    );
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await ProductService.getProduct(req.params.id);
    sendResponse(res, 200, product, "Producto encontrado.");
  } catch (error) {
    next(error);
  }
}

async function getProductsCatalog(req, res, next) {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice,
      sortBy = 'uploadData',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const filters = { 
      isActiveInCatalog: true, 
      isActive: true
    };
    
    if (category) filters.category = category;
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { namePublic: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { characteristics: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtro de rango de precios
    if (minPrice || maxPrice) {
      filters.salePrice = {};
      if (minPrice) filters.salePrice.$gte = parseFloat(minPrice);
      if (maxPrice) filters.salePrice.$lte = parseFloat(maxPrice);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: ['category']
    };

    const productsCatalog = await ProductService.getProducts(filters, options);
    
    sendResponse(
      res,
      200,
      productsCatalog,
      productsCatalog.data?.length > 0 || productsCatalog.length > 0
        ? "Productos de catálogo encontrados."
        : "No se encontraron productos de catálogo."
    );
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const updateData = req.body;
    
    // Añadir información del usuario si está disponible
    if (req.user?.id) {
      updateData.updatedBy = req.user.id;
    }
    
    const updatedProduct = await ProductService.updateProduct(
      req.params.id,
      updateData
    );
    sendResponse(res, 200, updatedProduct, "Producto actualizado con éxito.");
  } catch (error) {
    next(error);
  }
}

async function updateStock(req, res, next) {
  try {
    const { quantity, operation = 'set' } = req.body;
    
    if (typeof quantity !== 'number' || quantity < 0) {
      return sendResponse(res, 400, null, "Cantidad inválida.");
    }
    
    const updatedProduct = await ProductService.updateStock(
      req.params.id,
      quantity,
      operation
    );
    
    sendResponse(res, 200, updatedProduct, "Stock actualizado con éxito.");
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await ProductService.deleteProduct(req.params.id);
    sendResponse(res, 200, null, "Producto eliminado con éxito.");
  } catch (error) {
    next(error);
  }
}

async function getProductStats(req, res, next) {
  try {
    const stats = await ProductService.getProductStats();
    sendResponse(res, 200, stats, "Estadísticas obtenidas con éxito.");
  } catch (error) {
    next(error);
  }
}

async function getLowStockProducts(req, res, next) {
  try {
    const lowStockProducts = await ProductService.getLowStockProducts();
    sendResponse(
      res, 
      200, 
      lowStockProducts, 
      lowStockProducts.length > 0 
        ? "Productos con stock bajo encontrados."
        : "No hay productos con stock bajo."
    );
  } catch (error) {
    next(error);
  }
}

async function getProductsByCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const products = await ProductService.getProductsByCategory(categoryId);
    sendResponse(
      res,
      200,
      products,
      products.length > 0
        ? "Productos de la categoría encontrados."
        : "No se encontraron productos en esta categoría."
    );
  } catch (error) {
    next(error);
  }
}

export {
  createProduct,
  getProducts,
  getProduct,
  getProductsCatalog,
  updateProduct,
  updateStock,
  deleteProduct,
  getProductStats,
  getLowStockProducts,
  getProductsByCategory,
};
