import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
  },
  namePublic: {
    type: String,
    default: "",
    required: false,
  },
  quantity: {
    type: Number,
    default: 0,
    required: true,
  },
  quantitiesSold: {
    type: Number,
    default: 0,
    required: false,
  },
  stock: {
    type: Number,
    default: 0,
    required: false,
  },
  batch: {
    type: Number,
    default: 0,
    required: true,
  },
  isActiveInCatalog: {
    type: Boolean,
    default: false,
    required: false,
  },
  images: {
    type: Array,
    default: [],
    required: false,
  },
  characteristics: {
    type: String,
    default: "",
    required: false,
  },
  references: {
    type: Array,
    required: false,
  },
  basePrice: {
    type: Number,
    default: 0,
    required: true,
  },
  salePrice: {
    type: Number,
    default: 0,
    required: true,
  },
  wholesalePrice: {
    type: Number,
    default: 0,
    required: false,
  },
  wholesaleQuantity: {
    type: Number,
    default: 0,
    required: false,
  },
  isWholesaleMix: {
    type: Boolean,
    default: false,
    required: false,
  },
  isOffer: {
    type: Boolean,
    default: false,
    required: false,
  },
  rating: {
    type: Number,
    default: 0,
    required: false,
  },
  uploadData: {
    type: Date,
    default: Date.now,
  },
});

export default model("Product", productSchema);
