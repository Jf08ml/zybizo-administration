import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  deliveryAddress: {
    type: Object,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  deliveryType: {
    type: String,
    required: false,
    default: "Normal"
  },
  totalToPay: {
    type: Number,
    required: true,
  },
});

export default model("Order", orderSchema);
