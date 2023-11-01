import { Schema, Types, model } from "mongoose";

const expenseSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["Order", "Discount", "Other"],
    required: true,
  },
});
export default model("Expense", expenseSchema);
