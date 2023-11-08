import Product from "../models/product";

async function createProduct(req, res) {
  const { product } = req.body;
  product.stock = product.quantity;
  try {
    const newProduct = new Product(product);
    await newProduct.save();
    return res.status(200).json({ result: "success", product: newProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: "error",
      message: "An error occurred while saving the series.",
    });
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).json({ result: "success", products: products });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

async function getProductsCatalog(req, res) {
  try {
    const productsCatalog = await Product.find({isActiveInCatalog: true});
    res.status(200).json({ result: "success", products: productsCatalog });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const updatedFields = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedFields,
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ result: "error", message: "Producto no encontrado" });
    }

    res.status(200).json({ result: "success", product: updatedProduct });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
}

async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;

    await Product.findByIdAndDelete(productId);

    res
      .status(200)
      .json({ result: "success", message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
}

export { createProduct, getProducts, getProductsCatalog, updateProduct, deleteProduct };
