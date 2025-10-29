import orderService from "../services/order.service.js";
import { response } from "../utils/response.js";

class OrderController {
  // Crear nueva orden (POS)
  async createOrder(req, res) {
    try {
      console.log('OrderController: Creating order with data:', req.body);
      
      const order = await orderService.createOrder(req.body);
      
      response(res, {
        status: 201,
        success: true,
        message: "Orden creada exitosamente.",
        data: order
      });
    } catch (error) {
      console.error("Error in createOrder:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor.",
        errors: error.errors || undefined
      });
    }
  }

  // Obtener órdenes con filtros y paginación
  async getOrders(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        paymentStatus,
        dateFrom,
        dateTo,
        customerEmail,
        customerPhone,
        orderNumber
      } = req.query;

      // Construir filtros
      const filters = {};
      
      if (status) filters.status = status;
      if (paymentStatus) filters.paymentStatus = paymentStatus;
      if (customerEmail) filters['customer.email'] = new RegExp(customerEmail, 'i');
      if (customerPhone) filters['customer.phone'] = new RegExp(customerPhone, 'i');
      if (orderNumber) filters.orderNumber = new RegExp(orderNumber, 'i');
      
      if (dateFrom || dateTo) {
        filters.createdAt = {};
        if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
        if (dateTo) filters.createdAt.$lte = new Date(dateTo);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: ['items.product']
      };

      const result = await orderService.getOrders(filters, options);
      
      response(res, {
        status: 200,
        success: true,
        message: "Órdenes obtenidas exitosamente.",
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error("Error in getOrders:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Obtener orden por ID
  async getOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrder(id);
      
      response(res, {
        status: 200,
        success: true,
        message: "Orden obtenida exitosamente.",
        data: order
      });
    } catch (error) {
      console.error("Error in getOrder:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Actualizar estado de orden
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedBy = req.user?.id;
      
      const order = await orderService.updateOrderStatus(id, status, updatedBy);
      
      response(res, {
        status: 200,
        success: true,
        message: "Estado de orden actualizado exitosamente.",
        data: order
      });
    } catch (error) {
      console.error("Error in updateOrderStatus:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Cancelar orden
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const { reason = "" } = req.body;
      const cancelledBy = req.user?.id;
      
      const order = await orderService.cancelOrder(id, reason, cancelledBy);
      
      response(res, {
        status: 200,
        success: true,
        message: "Orden cancelada exitosamente. Stock restaurado.",
        data: order
      });
    } catch (error) {
      console.error("Error in cancelOrder:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Obtener estadísticas de ventas
  async getSalesStats(req, res) {
    try {
      const { dateFrom, dateTo } = req.query;
      
      if (!dateFrom || !dateTo) {
        return response(res, {
          status: 400,
          success: false,
          message: "Las fechas dateFrom y dateTo son requeridas."
        });
      }
      
      const stats = await orderService.getSalesStats(dateFrom, dateTo);
      
      response(res, {
        status: 200,
        success: true,
        message: "Estadísticas obtenidas exitosamente.",
        data: stats
      });
    } catch (error) {
      console.error("Error in getSalesStats:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Obtener órdenes de hoy
  async getTodaysOrders(req, res) {
    try {
      const orders = await orderService.getTodaysOrders();
      
      response(res, {
        status: 200,
        success: true,
        message: "Órdenes de hoy obtenidas exitosamente.",
        data: orders
      });
    } catch (error) {
      console.error("Error in getTodaysOrders:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Dashboard rápido de POS
  async getPOSDashboard(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Obtener datos del día
      const [
        todaysOrders,
        todaysStats
      ] = await Promise.all([
        orderService.getTodaysOrders(),
        orderService.getSalesStats(today.toISOString(), tomorrow.toISOString())
      ]);
      
      // Calcular métricas adicionales
      const pendingOrders = todaysOrders.filter(order => order.status === 'pending').length;
      const completedOrders = todaysOrders.filter(order => order.status === 'delivered').length;
      
      response(res, {
        status: 200,
        success: true,
        message: "Dashboard POS obtenido exitosamente.",
        data: {
          todayStats: {
            ...todaysStats,
            pendingOrders,
            completedOrders
          },
          recentOrders: todaysOrders.slice(0, 10) // 10 órdenes más recientes
        }
      });
    } catch (error) {
      console.error("Error in getPOSDashboard:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }
}

export default new OrderController();
