import customerService from "../services/customer.service.js";
import { response } from "../utils/response.js";

class CustomerController {
  // Buscar cliente por identificador
  async findByIdentifier(req, res) {
    try {
      const { identifier } = req.params;
      const customer = await customerService.findByIdentifier(identifier);
      
      response(res, {
        status: 200,
        success: true,
        message: customer ? "Cliente encontrado." : "Cliente no encontrado.",
        data: customer
      });
    } catch (error) {
      console.error("Error in findByIdentifier:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Buscar clientes (autocompletar)
  async searchCustomers(req, res) {
    try {
      const { q: searchTerm, limit = 10 } = req.query;
      
      if (!searchTerm || searchTerm.trim().length < 2) {
        return response(res, {
          status: 400,
          success: false,
          message: "El término de búsqueda debe tener al menos 2 caracteres."
        });
      }
      
      const customers = await customerService.searchCustomers(searchTerm, parseInt(limit));
      
      response(res, {
        status: 200,
        success: true,
        message: "Búsqueda completada.",
        data: customers
      });
    } catch (error) {
      console.error("Error in searchCustomers:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Crear o actualizar cliente
  async createOrUpdate(req, res) {
    try {
      const customerData = req.body;
      const customer = await customerService.createOrUpdate(customerData);
      
      response(res, {
        status: 201,
        success: true,
        message: "Cliente guardado exitosamente.",
        data: customer
      });
    } catch (error) {
      console.error("Error in createOrUpdate:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Obtener cliente por ID
  async getCustomer(req, res) {
    try {
      const { id } = req.params;
      const customer = await customerService.getCustomer(id);
      
      response(res, {
        status: 200,
        success: true,
        message: "Cliente obtenido exitosamente.",
        data: customer
      });
    } catch (error) {
      console.error("Error in getCustomer:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Listar clientes
  async getCustomers(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        customerType,
        status,
        sortBy = 'personalInfo.firstName',
        sortOrder = 'asc'
      } = req.query;

      const filters = {};
      if (search) filters.search = search;
      if (customerType) filters.customerType = customerType;
      if (status) filters.status = status;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
      };

      const result = await customerService.getCustomers(filters, options);
      
      response(res, {
        status: 200,
        success: true,
        message: "Clientes obtenidos exitosamente.",
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error("Error in getCustomers:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Eliminar cliente
  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const customer = await customerService.deleteCustomer(id);
      
      response(res, {
        status: 200,
        success: true,
        message: "Cliente eliminado exitosamente.",
        data: customer
      });
    } catch (error) {
      console.error("Error in deleteCustomer:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Cambiar estado del cliente
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const customer = await customerService.toggleCustomerStatus(id, status);
      
      response(res, {
        status: 200,
        success: true,
        message: "Estado del cliente actualizado exitosamente.",
        data: customer
      });
    } catch (error) {
      console.error("Error in toggleStatus:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }

  // Obtener estadísticas de clientes
  async getStats(req, res) {
    try {
      const stats = await customerService.getCustomerStats();
      
      response(res, {
        status: 200,
        success: true,
        message: "Estadísticas obtenidas exitosamente.",
        data: stats
      });
    } catch (error) {
      console.error("Error in getStats:", error);
      response(res, {
        status: error.statusCode || 500,
        success: false,
        message: error.message || "Error interno del servidor."
      });
    }
  }
}

export default new CustomerController();