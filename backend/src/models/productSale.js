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
  batch: {
    type: Number,
    default: 0,
    required: true,
  },
  salePrice: {
    type: Number,
    default: 0,
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  uploadData: {
    type: Date,
    default: Date.now,
  },
});

export default model("ProductSale", productSchema);
