import Order from "../models/order.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError, ValidationError } = CustomErrors;

class OrderService {
  async createOrder(data) {
    try {
      const newOrder = new Order(data);
      return await newOrder.save();
    } catch (error) {
        console.log(error);
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError("Error al crear el pedido.");
    }
  }

  async getOrders() {
    try {
      const orders = await Order.find();
      return orders;
    } catch (error) {
      throw new DatabaseError("Error al obtener los pedidos.");
    }
  }

  async getReward(id) {
    try {
      const order = await Order.findById(id);
      if (!order) {
        throw new NotFoundError("Pedido no encontrado.");
      }
      return reward;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al obtener el pedido.");
    }
  }

  async getOrderByField(searchParams) {
    try {
      const order = await Order.findOne(searchParams);
      if (order.length === 0) {
        throw new NotFoundError(
          "No se encontraron pedidos con los criterios especificados."
        );
      }
      return rewards;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al buscar el pedido.");
    }
  }

  async updateOrder(orderId, updateData) {
    try {
      const updatedReward = await Order.findByIdAndUpdate(orderId, updateData, {
        new: true,
      });
      if (!updatedReward) {
        throw new NotFoundError("Pedido no encontrada para actualizar.");
      }
      return updatedReward;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al actualizar la recompensa.");
    }
  }

  async deleteOrder(orderId) {
    try {
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        throw new NotFoundError("Pedido no encontrado para eliminar.");
      }
      return deletedOrder;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al eliminar el pedido.");
    }
  }
}

export default new OrderService();
