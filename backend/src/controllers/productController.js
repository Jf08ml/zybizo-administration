import ProductService from "../services/product.service";
import CustomErrors from "../errors/CustomErrors.js";

const { NotFoundError } = CustomErrors;

async function createProduct(req, res) {
  try {
    const newProduct = await ProductService.createProduct(req.body.product);
    res.status(201).json({
      status: "success",
      data: newProduct,
      message: "Producto creado exitosamente.",
    });
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res) {
  try {
    const products = await ProductService.getProducts();
    res.status(200).json({
      status: "success",
      data: products,
      message:
        rewards.length > 0
          ? "Productos encontrados."
          : "No se encontraron productos.",
    });
  } catch (error) {
    next(error);
  }
}

async function getProductsCatalog(req, res) {
  try {
    const productsCatalog = await ProductService.getProducts({
      isActiveInCatalog: true,
    });
    res.status(200).json({
      status: "success",
      data: productsCatalog,
      message:
        rewards.length > 0
          ? "Productos  de catálogo encontrados."
          : "No se encontraron productos de catálogo.",
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res) {
  try {
    const updatedProduct = await ProductService.updateProduct(
      req.params.id,
      req.body
    );
    res.status(200).json({
      status: "success",
      data: updatedProduct,
      message: "Producto actualizado con éxito.",
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(error);
    }
    next(error);
  }
}

async function deleteProduct(req, res) {
  try {
    await ProductService.deleteProduct(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Producto eliminado con éxito.",
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(error);
    }
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
