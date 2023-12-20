import Product from "../models/product";
import ProductSale from "../models/productSale";

async function createProductSale(req, res) {
  const { productSale } = req.body;
  try {
    const newProductSale = new ProductSale(productSale);
    await newProductSale.save();

    const product = await Product.findById(productSale.productId);
    if (!product) {
      return res
        .status(404)
        .json({ result: "error", message: "Product not found" });
    }

    product.quantitiesSold += productSale.quantity;
    product.stock -= productSale.quantity;
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

async function handleReturn(req, res) {
  const { id } = req.params;
  const { status, returnReason, exchangeProductId } = req.body;

  try {
    const sale = await ProductSale.findById(id);
    if (!sale) {
      return res.status(404).json({
        result: "error",
        message: "Venta no encontrada",
      });
    }

    if (status === "Refund" && returnReason === "Product exchange") {
      const exchangeProduct = await Product.findById(exchangeProductId);
      if (!exchangeProduct) {
        return res.status(404).json({
          result: "error",
          message: "Producto de intercambio no encontrado",
        });
      }

      sale.status = "Refund";
      sale.returnReason = returnReason;
      sale.exchangeProductId = exchangeProductId;
      sale.exchangeProductPrice = exchangeProduct.salePrice;

      if (exchangeProduct.salePrice > sale.salePrice) {
        sale.refundAmount = exchangeProduct.salePrice - sale.salePrice;
      } else if (exchangeProduct.salePrice < sale.salePrice) {
        sale.refundAmount = sale.salePrice - exchangeProduct.salePrice;
      }
    } else if (status === "Refund") {
      sale.status = "Refund";
      sale.returnReason = returnReason;
      sale.refundAmount = sale.salePrice;
    }

    await sale.save();
    return res.status(200).json({
      result: "success",
      sale,
    });
  } catch (error) {
    console.error("Error al manejar la devolución:", error);
    return res.status(500).json({
      result: "error",
      message: "Hubo un error al manejar la devolución",
    });
  }
}

export { createProductSale, getProductsSale, handleReturn };
