import Product from "../models/product.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError, ValidationError } = CustomErrors;

class ProductService {
  async createProduct(data) {
    try {
      data.stock = data.quantity;

      const newProduct = await Product(data);
      return await newProduct.save();
    } catch (error) {
      throw new DatabaseError("Error al crear el producto.");
    }
  }

  async getProducts(options = {}) {
    try {
      const products = await Product.find(options);
      return products;
    } catch (error) {
      throw new DatabaseError("Error al obtener los producto.");
    }
  }

  async getProduct(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new NotFoundError("Producto no encontrado.");
      }
      return reward;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al obtener el producto.");
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
        throw new NotFoundError("Producto no encontrado para actualizar.");
      }
      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al actualizar el producto.");
    }
  }

  async deleteProduct(productId) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new NotFoundError("Producto no encontrado para eliminar.");
      }
      return deletedProduct;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al eliminar el producto.");
    }
  }
}

export default new ProductService();
