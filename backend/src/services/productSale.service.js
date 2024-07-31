import Product from "../models/product.js";
import ProductSale from "../models/productSale.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError } = CustomErrors;

class ProductSaleService {
  async createProductSale(productSaleData) {
    try {
      const newProductSale = new ProductSale(productSaleData);
      await newProductSale.save();

      const product = await Product.findById(productSaleData.productId);
      if (!product) {
        throw new NotFoundError("Producto no encontrado.");
      }

      for (const selected of newProductSale.selectedReferences) {
        const { reference, option } = selected;

        const productReference = product.references.find(
          (ref) => ref.name === reference
        );
        if (!productReference) {
          throw new Error(
            `Referencia ${reference} no encontrada en el producto.`
          );
        }

        const opt = productReference.options.find(
          (opt) => opt.value === option
        );
        if (!opt) {
          throw new Error(
            `Opción ${option} no encontrada en la referencia ${reference}.`
          );
        }

        // Decrementar el stock
        opt.stocks -= parseInt(productSaleData.quantity, 10);
      }

      // Actualizar cantidades y stock del producto
      product.quantitiesSold += parseInt(productSaleData.quantity, 10);
      product.stock -= parseInt(productSaleData.quantity, 10);

      // Actualizar el producto completo en la base de datos
      await Product.findByIdAndUpdate(product._id, product, { new: true });

      return newProductSale;
    } catch (error) {
      console.error("Error al crear la venta de producto:", error);
      throw new Error("No se pudo crear la venta de producto.");
    }
  }

  async getProductsSale() {
    try {
      const products = await ProductSale.find();
      return products;
    } catch (error) {
      throw new DatabaseError("Error al obtener las ventas.");
    }
  }

  async handleReturn(id, returnData) {
    try {
      const sale = await ProductSale.findById(id);
      if (!sale) {
        throw new NotFoundError("Venta no encontrada.");
      }
      const { status, returnReason, exchangeProductId } = returnData;

      if (status === "Refund" && returnReason === "Product exchange") {
        const exchangeProduct = await Product.findById(exchangeProductId);
        if (!exchangeProduct) {
          return res.status(404).json({
            result: "error",
            message: "Producto de intercambio no encontrado.",
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
      return sale;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Hubo un error al manejar la devolución.");
    }
  }
}

export default new ProductSaleService();
