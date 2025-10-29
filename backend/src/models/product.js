import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  
  // Información básica
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  namePublic: {
    type: String,
    default: "",
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: "",
    maxlength: 1000
  },
  characteristics: {
    type: String,
    default: "",
    maxlength: 1000
  },
  
  // Categorización
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Identificación
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  batch: {
    type: String,
    default: "",
    trim: true
  },
  
  // Inventario
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  minStock: {
    type: Number,
    default: 5,
    min: 0
  },
  quantitiesSold: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Precios
  basePrice: {
    type: Number,
    default: 0,
    min: 0,
    required: true
  },
  salePrice: {
    type: Number,
    default: 0,
    min: 0,
    required: true
  },
  wholesalePrice: {
    type: Number,
    default: 0,
    min: 0
  },
  wholesaleQuantity: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Multimedia
  images: [{
    type: String
  }],
  
  // Referencias/Variantes
  references: [{
    name: { type: String, required: true },
    options: [{
      label: { type: String, required: true },
      value: { type: String, required: true },
      stocks: { type: Number, default: 0, min: 0 }
    }]
  }],
  
  // Estado y configuración
  isActiveInCatalog: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isWholesaleMix: {
    type: Boolean,
    default: false
  },
  isOffer: {
    type: Boolean,
    default: false
  },
  
  // Calificación
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // Auditoría
  uploadData: {
    type: Date,
    default: Date.now
  },
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

// Índices para mejor rendimiento
productSchema.index({ name: "text", description: "text", characteristics: "text" });
productSchema.index({ category: 1, isActiveInCatalog: 1 });
productSchema.index({ salePrice: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ isActiveInCatalog: 1, isActive: 1 });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });

// Virtuals
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.minStock && this.stock > 0;
});

productSchema.virtual('isOutOfStock').get(function() {
  return this.stock <= 0;
});

productSchema.virtual('totalVariantStock').get(function() {
  if (!this.references || this.references.length === 0) return this.stock;
  
  return this.references.reduce((total, ref) => {
    return total + ref.options.reduce((optTotal, opt) => optTotal + (opt.stocks || 0), 0);
  }, 0);
});

// Middleware
productSchema.pre('save', function(next) {
  // Auto-generar SKU si no existe
  if (!this.sku) {
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `PRD-${timestamp}`;
  }
  
  // Sincronizar quantity con stock
  if (this.isModified('stock')) {
    this.quantity = this.stock;
  }
  
  next();
});

// Métodos de instancia
productSchema.methods.updateStock = function(newStock, operation = 'set') {
  if (operation === 'add') {
    this.stock += newStock;
  } else if (operation === 'subtract') {
    this.stock = Math.max(0, this.stock - newStock);
  } else {
    this.stock = Math.max(0, newStock);
  }
  
  this.quantity = this.stock;
  return this.save();
};

// Métodos estáticos
productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId, isActive: true })
    .populate('category');
};

productSchema.statics.findLowStock = function() {
  return this.find({
    $expr: { $lte: ["$stock", "$minStock"] },
    stock: { $gt: 0 },
    isActive: true
  });
};

productSchema.statics.findActiveProducts = function() {
  return this.find({ isActive: true, isActiveInCatalog: true })
    .populate('category');
};

export default model("Product", productSchema);
