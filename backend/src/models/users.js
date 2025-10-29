import { Schema, Types, model } from "mongoose";
import bcrypt from "bcryptjs";
const { genSalt, hash: _hash, compare } = bcrypt;

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await genSalt(10);
  const hash = await _hash(user.password, salt);

  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

export default model("User", userSchema);
