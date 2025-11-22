import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Location", locationSchema);
