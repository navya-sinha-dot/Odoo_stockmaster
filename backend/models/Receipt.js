import mongoose from "mongoose";

const receiptItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  uom: { type: String },
});

const receiptSchema = new mongoose.Schema({
  supplier: { type: String }, // vendor name or id
  reference: { type: String }, // optional ref code
  items: [receiptItemSchema],
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

export default mongoose.model("Receipt", receiptSchema);
