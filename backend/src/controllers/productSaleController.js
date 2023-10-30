import Product from "../models/product";
import ProductSale from "../models/productSale";

async function createProductSale(req, res) {
  const { productSale } = req.body;
console.log(productSale);
  try {
    const newProductSale = new ProductSale(productSale);
    await newProductSale.save();

    const product = await Product.findById(productSale.productId);
    if (!product) {
      return res
        .status(404)
        .json({ result: "error", message: "Product not found" });
    }

    product.quantitiesSold = product.quantitiesSold + 1;
    product.stock = product.stock - 1;
    await product.save();

    return res
      .status(200)
      .json({ result: "success", productSale: newProductSale });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: "error",
      message: "An error occurred while saving the sale.",
    });
  }
}

async function getProductsSale(req, res) {
  try {
    const products = await ProductSale.find();
    res.status(200).json({ result: "success", products: products });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

export { createProductSale, getProductsSale };
