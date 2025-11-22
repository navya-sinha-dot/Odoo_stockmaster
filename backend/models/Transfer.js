import mongoose from "mongoose";

const transferItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  fromLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  toLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  uom: { type: String },
});

const transferSchema = new mongoose.Schema({
  reference: { type: String }, // e.g. TRF-001
  items: [transferItemSchema],
  status: {
    type: String,
    enum: ["Draft", "Validated", "Canceled"],
    default: "Draft",
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  validatedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Transfer", transferSchema);
