import { Schema, Types, model } from "mongoose";

const categorySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    default: "",
    maxlength: 500
  },
  
  // Campos opcionales para personalización futura
  icon: {
    type: String,
    default: "category"
  },
  color: {
    type: String,
    default: "#6B7280"
  },
  image: {
    type: String,
    default: ""
  },
  
  // Jerarquía de categorías
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  path: {
    type: String,
    default: ""
  },
  
  // Estado y configuración
  isActive: {
    type: Boolean,
    default: true
  },
  isVisibleInMenu: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // Metadatos para SEO (opcional - para futuro)
  seo: {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    keywords: { type: String, default: "" } // Simplificado como string
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

// Índices para mejor rendimiento
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent: 1, level: 1 });
categorySchema.index({ isActive: 1, isVisibleInMenu: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ path: 1 });

// Virtual para obtener hijos
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual para obtener productos de esta categoría
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Virtual para obtener el conteo de productos
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Middleware para generar slug automáticamente
categorySchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD') // Normalizar caracteres Unicode
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos y diacríticos
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno solo
      .trim('-'); // Remover guiones al inicio/final
  }
  
  // Generar path basado en la jerarquía
  if (this.isModified('parent') || this.isModified('slug')) {
    this.generatePath();
  }
  
  next();
});

// Método para generar el path de la categoría
categorySchema.methods.generatePath = async function() {
  if (!this.parent) {
    this.path = this.slug;
    this.level = 0;
  } else {
    const parent = await this.constructor.findById(this.parent);
    if (parent) {
      this.path = `${parent.path}/${this.slug}`;
      this.level = parent.level + 1;
    }
  }
};

// Método para obtener la jerarquía completa
categorySchema.methods.getHierarchy = async function() {
  const hierarchy = [];
  let current = this;
  
  while (current) {
    hierarchy.unshift({
      _id: current._id,
      name: current.name,
      slug: current.slug,
      level: current.level
    });
    
    if (current.parent) {
      current = await this.constructor.findById(current.parent);
    } else {
      break;
    }
  }
  
  return hierarchy;
};

// Método estático para obtener árbol de categorías
categorySchema.statics.getTree = function(parentId = null) {
  return this.find({ parent: parentId, isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('children');
};

// Método estático para obtener categorías raíz
categorySchema.statics.getRootCategories = function() {
  return this.find({ parent: null, isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

// Middleware para limpiar referencias al eliminar
categorySchema.pre('findOneAndDelete', async function() {
  const categoryId = this.getQuery()._id;
  
  // Mover productos de esta categoría a "sin categoría" o eliminar referencia
  await model('Product').updateMany(
    { category: categoryId },
    { $unset: { category: 1 } }
  );
  
  // Mover subcategorías al padre de esta categoría
  const category = await this.model.findById(categoryId);
  if (category) {
    await this.model.updateMany(
      { parent: categoryId },
      { parent: category.parent }
    );
  }
});

export default model("Category", categorySchema);