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

export { createProduct, getProducts };
