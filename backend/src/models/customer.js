import { Schema, Types, model } from "mongoose";

const customerSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  
  // Identificador único para buscar al cliente
  identifier: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  
  // Información personal
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    documentType: {
      type: String,
      enum: ['CC', 'TI', 'CE', 'PA', 'NIT'],
      default: 'CC'
    },
    documentNumber: {
      type: String,
      trim: true,
      sparse: true,
      index: true
    },
    dateOfBirth: {
      type: Date,
      required: false
    },
    gender: {
      type: String,
      enum: ['M', 'F', 'O'],
      required: false
    }
  },
  
  // Información de contacto
  contactInfo: {
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      index: true
    },
    alternativePhone: {
      type: String,
      trim: true
    }
  },
  
  // Direcciones (puede tener múltiples)
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'billing', 'shipping'],
      default: 'home'
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    neighborhood: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      trim: true,
      default: 'Huila'
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      default: 'Colombia'
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  
  // Información comercial
  commercialInfo: {
    customerType: {
      type: String,
      enum: ['retail', 'wholesale', 'vip'],
      default: 'retail'
    },
    taxId: {
      type: String,
      trim: true
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    creditLimit: {
      type: Number,
      default: 0,
      min: 0
    },
    paymentTerms: {
      type: Number,
      default: 0, // días
      min: 0
    }
  },
  
  // Estadísticas de compras
  purchaseStats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    lastOrderDate: {
      type: Date
    },
    firstOrderDate: {
      type: Date
    },
    averageOrderValue: {
      type: Number,
      default: 0
    }
  },
  
  // Estado del cliente
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  
  // Notas y comentarios
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos
customerSchema.index({ 'personalInfo.documentNumber': 1, 'personalInfo.documentType': 1 });
customerSchema.index({ 'contactInfo.phone': 1, status: 1 });
customerSchema.index({ 'contactInfo.email': 1, status: 1 });

// Virtuals
customerSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`.trim();
});

customerSchema.virtual('primaryAddress').get(function() {
  return this.addresses.find(addr => addr.isPrimary) || this.addresses[0];
});

// Middleware pre-save
customerSchema.pre('save', function(next) {
  // Asegurar que solo una dirección sea primaria
  const primaryAddresses = this.addresses.filter(addr => addr.isPrimary);
  if (primaryAddresses.length > 1) {
    this.addresses.forEach((addr, index) => {
      addr.isPrimary = index === 0;
    });
  } else if (primaryAddresses.length === 0 && this.addresses.length > 0) {
    this.addresses[0].isPrimary = true;
  }
  
  // Usar teléfono como identificador si no se especifica uno
  if (!this.identifier && this.contactInfo.phone) {
    this.identifier = this.contactInfo.phone;
  }
  
  next();
});

// Métodos de instancia
customerSchema.methods.addAddress = function(addressData) {
  // Si es la primera dirección, hacerla primaria
  if (this.addresses.length === 0) {
    addressData.isPrimary = true;
  }
  
  // Si se marca como primaria, desmarcar las demás
  if (addressData.isPrimary) {
    this.addresses.forEach(addr => {
      addr.isPrimary = false;
    });
  }
  
  this.addresses.push(addressData);
  return this.save();
};

customerSchema.methods.updatePurchaseStats = function(orderTotal) {
  this.purchaseStats.totalOrders += 1;
  this.purchaseStats.totalSpent += orderTotal;
  this.purchaseStats.lastOrderDate = new Date();
  
  if (!this.purchaseStats.firstOrderDate) {
    this.purchaseStats.firstOrderDate = new Date();
  }
  
  this.purchaseStats.averageOrderValue = 
    this.purchaseStats.totalSpent / this.purchaseStats.totalOrders;
  
  return this.save();
};

// Métodos estáticos
customerSchema.statics.findByIdentifier = function(identifier) {
  return this.findOne({ 
    identifier: identifier,
    status: { $ne: 'blocked' }
  });
};

customerSchema.statics.findByContact = function(phone, email = null) {
  const query = {
    $or: [
      { 'contactInfo.phone': phone },
      { identifier: phone }
    ],
    status: { $ne: 'blocked' }
  };
  
  if (email) {
    query.$or.push({ 'contactInfo.email': email });
  }
  
  return this.findOne(query);
};

customerSchema.statics.searchCustomers = function(searchTerm, limit = 10) {
  const regex = new RegExp(searchTerm, 'i');
  
  return this.find({
    $or: [
      { identifier: regex },
      { 'personalInfo.firstName': regex },
      { 'personalInfo.lastName': regex },
      { 'personalInfo.documentNumber': regex },
      { 'contactInfo.phone': regex },
      { 'contactInfo.email': regex }
    ],
    status: { $ne: 'blocked' }
  }).limit(limit);
};

export default model("Customer", customerSchema);