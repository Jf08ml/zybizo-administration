import Order from "../models/order.js";
import Product from "../models/product.js";
import Customer from "../models/customer.js";
import customerService from "./customer.service.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError, ValidationError } = CustomErrors;

class OrderService {
  // Crear orden con descuento automático de stock
  async createOrder(data) {
    const session = await Order.startSession();

    try {
      return await session.withTransaction(async () => {
        console.log('OrderService: Creating order with data:', data);

        // Transformar los datos para que coincidan con el modelo
        const transformedData = await this.transformOrderData(data);
        
        console.log('OrderService: Transformed data:', transformedData);

        // Validar stock disponible antes de crear la orden
        await this.validateStockAvailability(transformedData.items);

        // Crear la orden
        const newOrder = new Order(transformedData);

        // Descontar stock automáticamente
        await this.processStockReduction(transformedData.items, session);

        // Guardar la orden
        const savedOrder = await newOrder.save({ session });

        console.log('OrderService: Order created successfully:', savedOrder.orderNumber);
        
        // Actualizar estadísticas del cliente si existe
        if (transformedData.customer.customerId) {
          try {
            await customerService.updatePurchaseStats(transformedData.customer.customerId, transformedData.total);
          } catch (error) {
            console.warn('Could not update customer stats:', error.message);
          }
        }
        
        // Retornar la orden creada con los productos poblados
        return await Order.findById(savedOrder._id).populate('items.product');
      });

    } catch (error) {
      console.error("Error in createOrder:", error);

      if (error instanceof ValidationError) {
        throw error;
      }

      if (error.message.includes('stock')) {
        throw new ValidationError(error.message);
      }

      throw new DatabaseError("Error al crear la orden.");
    } finally {
      await session.endSession();
    }
  }

  // Transformar datos del frontend al formato del modelo
  async transformOrderData(data) {
    // Generar número de orden
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    const orderNumber = `ORD-${year}${month}${day}-${timestamp}`;

    // Procesar cliente
    let customer = null;
    let customerSnapshot = {
      name: data.customer.name,
      email: data.customer.email || '',
      phone: data.customer.phone || '',
      documentType: data.customer.documentType || '',
      documentNumber: data.customer.documentNumber || '',
      address: {
        street: data.customer.address || '',
        city: data.customer.city || '',
        state: data.customer.state || 'Huila',
        zipCode: data.customer.zipCode || '',
        country: 'Colombia'
      },
      notes: data.customer.notes || ''
    };

    // Si el cliente tiene identificador, buscar o crear en la colección Customer
    if (data.customer.identifier) {
      try {
        customer = await customerService.createOrUpdate({
          identifier: data.customer.identifier,
          firstName: data.customer.firstName || data.customer.name.split(' ')[0],
          lastName: data.customer.lastName || data.customer.name.split(' ').slice(1).join(' '),
          documentType: data.customer.documentType || 'CC',
          documentNumber: data.customer.documentNumber,
          phone: data.customer.phone,
          email: data.customer.email,
          address: data.customer.address ? {
            street: data.customer.address,
            city: data.customer.city,
            state: data.customer.state || 'Huila'
          } : null
        });

        // Actualizar snapshot con datos del cliente guardado
        customerSnapshot.customerId = customer._id;
        customerSnapshot.name = customer.fullName;
        customerSnapshot.email = customer.contactInfo.email || customerSnapshot.email;
        customerSnapshot.phone = customer.contactInfo.phone || customerSnapshot.phone;
        customerSnapshot.documentType = customer.personalInfo.documentType;
        customerSnapshot.documentNumber = customer.personalInfo.documentNumber || '';
        
        if (customer.primaryAddress) {
          customerSnapshot.address = {
            street: customer.primaryAddress.street,
            city: customer.primaryAddress.city,
            state: customer.primaryAddress.state,
            zipCode: customer.primaryAddress.zipCode || '',
            country: customer.primaryAddress.country
          };
        }

      } catch (error) {
        console.warn('Could not create/update customer:', error.message);
        // Continuar sin crear el cliente en la colección separada
      }
    }

    // Transformar items
    const transformedItems = data.items.map(item => ({
      product: item.product,
      name: item.name,
      sku: item.sku || '',
      quantity: item.quantity,
      unitPrice: item.price, // El precio que viene del frontend
      totalPrice: item.price * item.quantity, // Calcular totalPrice
      selectedVariant: item.selectedVariant || {},
      productSnapshot: {
        basePrice: item.price,
        category: '',
        description: '',
        image: item.image || ''
      }
    }));

    return {
      orderNumber,
      customer: customerSnapshot,
      items: transformedItems,
      subtotal: data.subtotal,
      tax: 0,
      discount: data.discountAmount || 0,
      shipping: data.shippingCost || 0,
      total: data.total,
      status: data.status || 'pending',
      orderType: 'pos',
      deliveryType: 'pickup',
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus || 'pending',
      paidAmount: data.paymentStatus === 'paid' ? data.total : 0,
      notes: data.customer.notes || '',
      internalNotes: data.internalNotes || ''
    };
  }

  // Validar disponibilidad de stock
  async validateStockAvailability(items) {
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new ValidationError(`Producto ${item.name} no encontrado.`);
      }

      if (!product.isActive) {
        throw new ValidationError(`Producto ${item.name} no está activo.`);
      }

      // Validar stock
      if (item.selectedVariant && Object.keys(item.selectedVariant).length > 0) {
        if (item.selectedVariant.selections) {
          // Variantes múltiples (nueva estructura)
          const isStockValid = this.validateMultipleVariantStock(product, item.selectedVariant.selections, item.quantity);
          if (!isStockValid) {
            throw new ValidationError(
              `Stock insuficiente para ${item.name} con las características seleccionadas. ` +
              `Solicitado: ${item.quantity}`
            );
          }
        } else if (item.selectedVariant.referenceName) {
          // Variante simple (compatibilidad)
          const variant = this.findVariantStock(product, item.selectedVariant);
          if (!variant || variant.stocks < item.quantity) {
            throw new ValidationError(
              `Stock insuficiente para ${item.name} - ${item.selectedVariant.optionLabel}. ` +
              `Disponible: ${variant?.stocks || 0}, Solicitado: ${item.quantity}`
            );
          }
        }
      } else {
        // Validar stock general del producto
        const totalStock = product.stock || product.quantity || 0;
        if (totalStock < item.quantity) {
          throw new ValidationError(
            `Stock insuficiente para ${item.name}. ` +
            `Disponible: ${totalStock}, Solicitado: ${item.quantity}`
          );
        }
      }
    }
  }

  // Validar stock para variantes múltiples
  validateMultipleVariantStock(product, selections, quantity) {
    if (!product.references || !selections) return false;

    // Validar que todas las referencias seleccionadas tengan stock suficiente
    for (const reference of product.references) {
      const selectedValue = selections[reference.name];
      
      // Si esta referencia fue seleccionada, validar su stock
      if (selectedValue) {
        const option = reference.options?.find(opt => opt.value === selectedValue);
        if (!option || option.stocks < quantity) {
          console.log(`Insufficient stock for ${reference.name}: ${selectedValue}. Available: ${option?.stocks || 0}, Required: ${quantity}`);
          return false;
        }
      }
    }

    // También validar que el stock general del producto sea suficiente
    const generalStock = product.stock || product.quantity || 0;
    if (generalStock < quantity) {
      console.log(`Insufficient general stock for ${product.name}. Available: ${generalStock}, Required: ${quantity}`);
      return false;
    }

    return true;
  }

  // Procesar reducción de stock
  async processStockReduction(items, session) {
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (item.selectedVariant && Object.keys(item.selectedVariant).length > 0) {
        if (item.selectedVariant.selections) {
          // Reducir stock de variantes múltiples
          await this.reduceMultipleVariantStock(product, item.selectedVariant.selections, item.quantity, session);
        } else if (item.selectedVariant.referenceName) {
          // Reducir stock de variante simple (compatibilidad)
          await this.reduceVariantStock(product, item.selectedVariant, item.quantity, session);
        }
      } else {
        // Reducir stock general
        const currentStock = product.stock || product.quantity || 0;
        product.stock = Math.max(0, currentStock - item.quantity);
        product.quantity = product.stock; // Sincronizar quantity
        product.quantitiesSold = (product.quantitiesSold || 0) + item.quantity;

        await product.save({ session });
      }

      console.log(`Stock reduced for ${item.name}: ${item.quantity} units`);
    }
  }

  // Reducir stock para variantes múltiples
  async reduceMultipleVariantStock(product, selections, quantity, session) {
    let stockReduced = false;

    // Solo reducir stock de las opciones específicas seleccionadas
    // No reducir de todas las referencias, solo de las seleccionadas
    for (const reference of product.references) {
      const selectedValue = selections[reference.name];
      
      // Solo procesar si esta referencia fue seleccionada
      if (selectedValue) {
        const option = reference.options?.find(opt => opt.value === selectedValue);
        if (option && option.stocks >= quantity) {
          option.stocks = Math.max(0, option.stocks - quantity);
          stockReduced = true;
          console.log(`Reduced stock for ${reference.name}: ${selectedValue} by ${quantity} units`);
        }
      }
    }

    // Solo reducir el stock general del producto UNA VEZ, no por cada referencia
    if (stockReduced) {
      const currentGeneralStock = product.stock || product.quantity || 0;
      product.stock = Math.max(0, currentGeneralStock - quantity);
      product.quantity = product.stock; // Sincronizar quantity
      product.quantitiesSold = (product.quantitiesSold || 0) + quantity;
      
      await product.save({ session });
      console.log(`Reduced general stock for ${product.name} by ${quantity} units. New stock: ${product.stock}`);
    }
  }

  // Encontrar stock de variante
  findVariantStock(product, selectedVariant) {
    const reference = product.references?.find(ref =>
      ref.name === selectedVariant.referenceName
    );

    const option = reference?.options?.find(opt =>
      opt.value === selectedVariant.optionValue
    );

    return option;
  }

  // Reducir stock de variante específica
  async reduceVariantStock(product, selectedVariant, quantity, session) {
    const reference = product.references.find(ref =>
      ref.name === selectedVariant.referenceName
    );

    if (reference) {
      const option = reference.options.find(opt =>
        opt.value === selectedVariant.optionValue
      );

      if (option) {
        option.stocks = Math.max(0, option.stocks - quantity);
        await product.save({ session });
      }
    }
  }

  // Obtener órdenes con filtros y paginación
  async getOrders(filters = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        sort = { createdAt: -1 },
        populate = ['items.product']
      } = options;

      let query = Order.find(filters);

      // Aplicar población
      if (populate.includes('items.product')) {
        query = query.populate('items.product', 'name sku images category');
      }

      // Aplicar ordenamiento
      query = query.sort(sort);

      // Paginación
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);

      const orders = await query.exec();
      const total = await Order.countDocuments(filters);

      return {
        data: orders,
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
      console.error("Error in getOrders:", error);
      throw new DatabaseError("Error al obtener las órdenes.");
    }
  }

  // Obtener orden por ID
  async getOrder(id) {
    try {
      const order = await Order.findById(id)
        .populate('items.product', 'name sku images category');

      if (!order) {
        throw new NotFoundError("Orden no encontrada.");
      }

      return order;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error("Error in getOrder:", error);
      throw new DatabaseError("Error al obtener la orden.");
    }
  }

  // Actualizar estado de orden
  async updateOrderStatus(orderId, status, updatedBy = null) {
    try {
      const validStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'];

      if (!validStatuses.includes(status)) {
        throw new ValidationError(`Estado inválido: ${status}`);
      }

      const updateData = {
        status,
        updatedBy
      };

      const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
        new: true,
        runValidators: true
      }).populate('items.product');

      if (!updatedOrder) {
        throw new NotFoundError("Orden no encontrada para actualizar.");
      }

      return updatedOrder;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      console.error("Error in updateOrderStatus:", error);
      throw new DatabaseError("Error al actualizar el estado de la orden.");
    }
  }

  // Cancelar orden y restaurar stock
  async cancelOrder(orderId, reason = "", cancelledBy = null) {
    const session = await Order.startSession();

    try {
      await session.withTransaction(async () => {
        const order = await Order.findById(orderId).session(session);

        if (!order) {
          throw new NotFoundError("Orden no encontrada.");
        }

        if (order.status === 'cancelled') {
          throw new ValidationError("La orden ya está cancelada.");
        }

        if (order.status === 'delivered') {
          throw new ValidationError("No se puede cancelar una orden entregada.");
        }

        // Restaurar stock
        await this.restoreStock(order.items, session);

        // Actualizar orden
        order.status = 'cancelled';
        order.internalNotes = `${order.internalNotes}\nCancelada: ${reason}`.trim();
        order.updatedBy = cancelledBy;

        await order.save({ session });

        console.log(`Order ${order.orderNumber} cancelled and stock restored`);
        return order;
      });

    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      console.error("Error in cancelOrder:", error);
      throw new DatabaseError("Error al cancelar la orden.");
    } finally {
      await session.endSession();
    }
  }

  // Restaurar stock al cancelar orden
  async restoreStock(items, session) {
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (product) {
        if (item.selectedVariant) {
          if (item.selectedVariant.selections) {
            // Restaurar stock de variantes múltiples
            await this.restoreMultipleVariantStock(product, item.selectedVariant.selections, item.quantity, session);
          } else if (item.selectedVariant.referenceName) {
            // Restaurar stock de variante simple (compatibilidad)
            await this.restoreVariantStock(product, item.selectedVariant, item.quantity, session);
          }
        } else {
          // Restaurar stock general
          product.stock += item.quantity;
          product.quantity = product.stock;
          product.quantitiesSold = Math.max(0, (product.quantitiesSold || 0) - item.quantity);

          await product.save({ session });
        }
      }
    }
  }

  // Restaurar stock para variantes múltiples
  async restoreMultipleVariantStock(product, selections, quantity, session) {
    let stockRestored = false;

    for (const reference of product.references) {
      const selectedValue = selections[reference.name];
      if (!selectedValue) continue;

      const option = reference.options?.find(opt => opt.value === selectedValue);
      if (option) {
        option.stocks += quantity;
        stockRestored = true;
      }
    }

    if (stockRestored) {
      await product.save({ session });
    }
  }

  // Restaurar stock de variante
  async restoreVariantStock(product, selectedVariant, quantity, session) {
    const reference = product.references.find(ref =>
      ref.name === selectedVariant.referenceName
    );

    if (reference) {
      const option = reference.options.find(opt =>
        opt.value === selectedVariant.optionValue
      );

      if (option) {
        option.stocks += quantity;
        await product.save({ session });
      }
    }
  }

  // Estadísticas de ventas
  async getSalesStats(dateFrom, dateTo) {
    try {
      const match = {
        paymentStatus: 'paid',
        createdAt: {
          $gte: new Date(dateFrom),
          $lte: new Date(dateTo)
        }
      };

      const stats = await Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$total' },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: '$total' },
            totalItems: { $sum: { $sum: '$items.quantity' } }
          }
        }
      ]);

      return stats[0] || {
        totalSales: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        totalItems: 0
      };
    } catch (error) {
      console.error("Error in getSalesStats:", error);
      throw new DatabaseError("Error al obtener estadísticas de ventas.");
    }
  }

  // Obtener órdenes de hoy
  async getTodaysOrders() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return await Order.find({
        createdAt: { $gte: today, $lt: tomorrow }
      }).populate('items.product').sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error in getTodaysOrders:", error);
      throw new DatabaseError("Error al obtener órdenes de hoy.");
    }
  }
}

export default new OrderService();
