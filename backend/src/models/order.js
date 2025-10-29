import { Schema, Types, model } from "mongoose";

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    default: ""
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  // Para variantes/referencias
  selectedVariant: {
    referenceName: { type: String, default: "" },
    optionLabel: { type: String, default: "" },
    optionValue: { type: String, default: "" }
  },
  // Snapshot de producto al momento de la venta
  productSnapshot: {
    basePrice: Number,
    category: String,
    description: String,
    image: String
  }
}, {
  _id: false
});

const customerSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: false // Puede ser null para clientes ocasionales
  },
  // Snapshot de datos del cliente al momento de la orden
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  documentType: {
    type: String,
    default: ""
  },
  documentNumber: {
    type: String,
    default: ""
  },
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "Colombia" }
  },
  notes: {
    type: String,
    default: ""
  }
}, {
  _id: false
});

const orderSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  
  // Numeración de órdenes
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Cliente
  customer: {
    type: customerSchema,
    required: true
  },
  
  // Items de la orden
  items: [orderItemSchema],
  
  // Cálculos financieros
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Estado de la orden
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Tipo de orden
  orderType: {
    type: String,
    enum: ['pos', 'online', 'phone', 'wholesale'],
    default: 'pos'
  },
  
  // Entrega
  deliveryType: {
    type: String,
    enum: ['pickup', 'delivery', 'shipping'],
    default: 'pickup'
  },
  deliveryAddress: {
    type: customerSchema.obj.address,
    required: false
  },
  deliveryDate: {
    type: Date,
    required: false
  },
  
  // Pago
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'check', 'credit'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'refunded'],
    default: 'pending'
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Notas y comentarios
  notes: {
    type: String,
    default: "",
    maxlength: 500
  },
  internalNotes: {
    type: String,
    default: "",
    maxlength: 500
  },
  
  // Auditoría
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  
  // Timestamps automáticos
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejor rendimiento
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ status: 1 });
orderSchema.index({ orderType: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "customer.email": 1 });
orderSchema.index({ "customer.phone": 1 });

// Virtuals
orderSchema.virtual('isPaid').get(function() {
  return this.paymentStatus === 'paid' || this.paidAmount >= this.total;
});

orderSchema.virtual('isCompleted').get(function() {
  return ['delivered', 'cancelled', 'refunded'].includes(this.status);
});

orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Middleware pre-save
orderSchema.pre('save', function(next) {
  // Auto-generar número de orden si no existe
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    this.orderNumber = `ORD-${year}${month}${day}-${timestamp}`;
  }
  
  // Actualizar timestamp
  this.updatedAt = new Date();
  
  // Recalcular totales
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.total = this.subtotal + this.tax + this.shipping - this.discount;
  
  next();
});

// Métodos de instancia
orderSchema.methods.addItem = function(productData, quantity, variants = null) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productData._id.toString() &&
    JSON.stringify(item.selectedVariant) === JSON.stringify(variants)
  );
  
  if (existingItemIndex >= 0) {
    // Actualizar cantidad si el item ya existe
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].totalPrice = 
      this.items[existingItemIndex].quantity * this.items[existingItemIndex].unitPrice;
  } else {
    // Añadir nuevo item
    this.items.push({
      product: productData._id,
      name: productData.name,
      sku: productData.sku || '',
      quantity: quantity,
      unitPrice: productData.salePrice,
      totalPrice: quantity * productData.salePrice,
      selectedVariant: variants || {},
      productSnapshot: {
        basePrice: productData.basePrice,
        category: productData.category?.name || '',
        description: productData.description,
        image: productData.images?.[0] || ''
      }
    });
  }
  
  return this.save();
};

orderSchema.methods.removeItem = function(productId, variants = null) {
  this.items = this.items.filter(item => 
    !(item.product.toString() === productId.toString() &&
      JSON.stringify(item.selectedVariant) === JSON.stringify(variants))
  );
  
  return this.save();
};

// Métodos estáticos
orderSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('items.product');
};

orderSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('items.product');
};

orderSchema.statics.getTodaysSales = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    createdAt: { $gte: today, $lt: tomorrow },
    paymentStatus: 'paid'
  });
};

export default model("Order", orderSchema);
