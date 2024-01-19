import ProductService from "../services/product.service";
import sendResponse from "../utils/response.js";

async function createProduct(req, res, next) {
  try {
    const newProduct = await ProductService.createProduct(req.body.product);
    sendResponse(res, 201, newProduct, "Producto creado exitosamente.");
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const products = await ProductService.getProducts();
    sendResponse(
      res,
      200,
      products,
      products.length > 0
        ? "Productos encontrados."
        : "No se encontraron productos."
    );
  } catch (error) {
    next(error);
  }
}

async function getProductsCatalog(req, res, next) {
  try {
    const productsCatalog = await ProductService.getProducts({
      isActiveInCatalog: true,
    });
    sendResponse(
      res,
      200,
      productsCatalog,
      productsCatalog.length > 0
        ? "Productos de catálogo encontrados."
        : "No se encontraron productos de catálogo."
    );
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const updatedProduct = await ProductService.updateProduct(
      req.params.id,
      req.body
    );
    sendResponse(res, 200, updatedProduct, "Producto actualizado con éxito.");
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

export {
  createProduct,
  getProducts,
  getProductsCatalog,
  updateProduct,
  deleteProduct,
};
