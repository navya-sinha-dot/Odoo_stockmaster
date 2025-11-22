import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  loginId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  otp: String,
  otpExpires: Date,

  role: { type: String, default: "inventory-manager" },
});

export default mongoose.model("User", userSchema);
