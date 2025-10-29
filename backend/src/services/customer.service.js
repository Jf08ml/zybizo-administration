import Customer from "../models/customer.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError, ValidationError } = CustomErrors;

class CustomerService {
  // Buscar cliente por identificador
  async findByIdentifier(identifier) {
    try {
      const customer = await Customer.findByIdentifier(identifier);
      return customer;
    } catch (error) {
      console.error("Error in findByIdentifier:", error);
      throw new DatabaseError("Error al buscar cliente.");
    }
  }

  // Buscar cliente por contacto (teléfono/email)
  async findByContact(phone, email = null) {
    try {
      const customer = await Customer.findByContact(phone, email);
      return customer;
    } catch (error) {
      console.error("Error in findByContact:", error);
      throw new DatabaseError("Error al buscar cliente por contacto.");
    }
  }

  // Buscar clientes (autocompletar)
  async searchCustomers(searchTerm, limit = 10) {
    try {
      const customers = await Customer.searchCustomers(searchTerm, limit);
      return customers;
    } catch (error) {
      console.error("Error in searchCustomers:", error);
      throw new DatabaseError("Error al buscar clientes.");
    }
  }

  // Crear o actualizar cliente
  async createOrUpdate(customerData) {
    try {
      const {
        identifier,
        firstName,
        lastName,
        documentType = 'CC',
        documentNumber,
        phone,
        email,
        address
      } = customerData;

      // Buscar si el cliente ya existe
      let customer = await Customer.findByIdentifier(identifier);

      if (customer) {
        // Actualizar cliente existente
        customer.personalInfo.firstName = firstName || customer.personalInfo.firstName;
        customer.personalInfo.lastName = lastName || customer.personalInfo.lastName;
        customer.personalInfo.documentType = documentType;
        customer.personalInfo.documentNumber = documentNumber || customer.personalInfo.documentNumber;
        customer.contactInfo.phone = phone || customer.contactInfo.phone;
        customer.contactInfo.email = email || customer.contactInfo.email;

        // Actualizar dirección si se proporciona
        if (address && address.street && address.city) {
          // Buscar si ya tiene una dirección similar
          const existingAddress = customer.addresses.find(addr => 
            addr.street === address.street && addr.city === address.city
          );

          if (!existingAddress) {
            await customer.addAddress({
              type: address.type || 'home',
              street: address.street,
              neighborhood: address.neighborhood || '',
              city: address.city,
              state: address.state || 'Huila',
              zipCode: address.zipCode || '',
              country: 'Colombia',
              notes: address.notes || ''
            });
          }
        }

        await customer.save();
      } else {
        // Crear nuevo cliente
        const newCustomerData = {
          identifier,
          personalInfo: {
            firstName,
            lastName,
            documentType,
            documentNumber
          },
          contactInfo: {
            phone,
            email
          }
        };

        // Agregar dirección si se proporciona
        if (address && address.street && address.city) {
          newCustomerData.addresses = [{
            type: address.type || 'home',
            isPrimary: true,
            street: address.street,
            neighborhood: address.neighborhood || '',
            city: address.city,
            state: address.state || 'Huila',
            zipCode: address.zipCode || '',
            country: 'Colombia',
            notes: address.notes || ''
          }];
        }

        customer = new Customer(newCustomerData);
        await customer.save();
      }

      return customer;
    } catch (error) {
      console.error("Error in createOrUpdate:", error);
      
      if (error.code === 11000) {
        throw new ValidationError("Ya existe un cliente con ese identificador.");
      }
      
      throw new DatabaseError("Error al crear o actualizar cliente.");
    }
  }

  // Obtener cliente por ID
  async getCustomer(id) {
    try {
      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw new NotFoundError("Cliente no encontrado.");
      }
      
      return customer;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error("Error in getCustomer:", error);
      throw new DatabaseError("Error al obtener cliente.");
    }
  }

  // Listar clientes con paginación
  async getCustomers(filters = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        sort = { 'personalInfo.firstName': 1 }
      } = options;

      // Construir filtros
      const query = { status: { $ne: 'blocked' } };
      
      if (filters.search) {
        const regex = new RegExp(filters.search, 'i');
        query.$or = [
          { 'personalInfo.firstName': regex },
          { 'personalInfo.lastName': regex },
          { 'personalInfo.documentNumber': regex },
          { 'contactInfo.phone': regex },
          { 'contactInfo.email': regex },
          { identifier: regex }
        ];
      }

      if (filters.customerType) {
        query['commercialInfo.customerType'] = filters.customerType;
      }

      if (filters.status) {
        query.status = filters.status;
      }

      // Ejecutar consulta con paginación
      const skip = (page - 1) * limit;
      const customers = await Customer.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Customer.countDocuments(query);

      return {
        data: customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error("Error in getCustomers:", error);
      throw new DatabaseError("Error al obtener clientes.");
    }
  }

  // Actualizar estadísticas de compra
  async updatePurchaseStats(customerId, orderTotal) {
    try {
      const customer = await Customer.findById(customerId);
      
      if (customer) {
        await customer.updatePurchaseStats(orderTotal);
      }
      
      return customer;
    } catch (error) {
      console.error("Error in updatePurchaseStats:", error);
      // No lanzar error para no afectar el flujo principal
    }
  }

  // Eliminar cliente (soft delete)
  async deleteCustomer(id) {
    try {
      const customer = await Customer.findByIdAndUpdate(
        id,
        { status: 'inactive' },
        { new: true }
      );

      if (!customer) {
        throw new NotFoundError("Cliente no encontrado.");
      }

      return customer;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error("Error in deleteCustomer:", error);
      throw new DatabaseError("Error al eliminar cliente.");
    }
  }

  // Activar/desactivar cliente
  async toggleCustomerStatus(id, status) {
    try {
      const validStatuses = ['active', 'inactive', 'blocked'];
      
      if (!validStatuses.includes(status)) {
        throw new ValidationError(`Estado inválido: ${status}`);
      }

      const customer = await Customer.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!customer) {
        throw new NotFoundError("Cliente no encontrado.");
      }

      return customer;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      console.error("Error in toggleCustomerStatus:", error);
      throw new DatabaseError("Error al cambiar estado del cliente.");
    }
  }

  // Obtener estadísticas de clientes
  async getCustomerStats() {
    try {
      const stats = await Customer.aggregate([
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            activeCustomers: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            retailCustomers: {
              $sum: { $cond: [{ $eq: ['$commercialInfo.customerType', 'retail'] }, 1, 0] }
            },
            wholesaleCustomers: {
              $sum: { $cond: [{ $eq: ['$commercialInfo.customerType', 'wholesale'] }, 1, 0] }
            },
            totalSpent: { $sum: '$purchaseStats.totalSpent' },
            totalOrders: { $sum: '$purchaseStats.totalOrders' }
          }
        }
      ]);

      return stats[0] || {
        totalCustomers: 0,
        activeCustomers: 0,
        retailCustomers: 0,
        wholesaleCustomers: 0,
        totalSpent: 0,
        totalOrders: 0
      };
    } catch (error) {
      console.error("Error in getCustomerStats:", error);
      throw new DatabaseError("Error al obtener estadísticas de clientes.");
    }
  }
}

export default new CustomerService();