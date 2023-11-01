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
  status: {
    type: String,
    enum: ["Done", "Refund"],
    default: "Done",
  },
  returnReason: {
    type: String,
    enum: ["Product exchange", "Defective product", "N/A"],
    default: "N/A",
  },
  refundAmount: {
    type: Number,
    default: 0,
  },
  exchangeProductId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  exchangeProductPrice: {
    type: Number,
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
