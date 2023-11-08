import { Schema, Types, model } from "mongoose";

const roleSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: Types.ObjectId,
  },
  name: {
    type: String,
    enum: ["Administrator", "Moderator", "Standard"],
    required: true,
  },
  permissions: [Object],
});

export default model("Role", roleSchema);
