import mongoose from "mongoose";

const adjustmentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },

  systemQty: { type: Number, required: true }, // quantity currently in DB
  countedQty: { type: Number, required: true }, // physical count entered by user
  difference: { type: Number, required: true }, // counted - system

  status: {
    type: String,
    enum: ["Draft", "Validated", "Canceled"],
    default: "Draft",
  },

  note: String,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  validatedAt: Date,

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Adjustment", adjustmentSchema);
