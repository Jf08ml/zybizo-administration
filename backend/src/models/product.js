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
  uploadData: {
    type: Date,
    default: Date.now,
  },
});

export default model("Product", productSchema);
