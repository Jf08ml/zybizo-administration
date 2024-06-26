import { Schema, Types, model } from "mongoose";

const rewardSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  participantName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    default: 0,
    required: true,
  },
  usernameInsta: {
    type: String,
    required: true,
  },
  reward: {
    type: String,
  },
  cupon: {
    codeCupon: {
      type: String,
    },
    valorCupon: {
      type: Number,
    },
    used: { type: Boolean, default: false },
  },
  uploadData: {
    type: Date,
    default: Date.now,
  },
});

export default model("Reward", rewardSchema);
