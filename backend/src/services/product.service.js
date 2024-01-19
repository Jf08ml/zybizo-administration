import Product from "../models/product.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError } = CustomErrors;

class ProductService {
  async createProduct(data) {
    try {
      data.stock = data.quantity;
      const newProduct = new Product(data);
      return await newProduct.save();
    } catch (error) {
      console.error("Error en createProduct:", error);
      DatabaseError.throw("Error al crear el producto.");
    }
  }

  async getProducts(options = {}) {
    try {
      const products = await Product.find(options);
      return products;
    } catch (error) {
      console.error("Error en getProducts:", error);
      DatabaseError.throw("Error al obtener los productos.");
    }
  }

  async getProduct(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        NotFoundError.throw("Producto no encontrado.");
      }
      return product;
    } catch (error) {
      console.error("Error en getProduct:", error);
      DatabaseError.throw("Error al obtener el producto.");
    }
  }

  async updateProduct(productId, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      );
      if (!updatedProduct) {
        NotFoundError.throw("Producto no encontrado para actualizar.");
      }
      return updatedProduct;
    } catch (error) {
      console.error("Error en updateProduct:", error);
      DatabaseError.throw("Error al actualizar el producto.");
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
}

export default new ProductService();
