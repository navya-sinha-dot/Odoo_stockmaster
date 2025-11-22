import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
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
  change: { type: Number, required: true }, // +ve for incoming, -ve for outgoing
  type: {
    type: String,
    enum: ["Receipt", "Delivery", "Transfer", "Adjustment"],
    required: true,
  },
  refId: { type: mongoose.Schema.Types.ObjectId }, // e.g., receipt id
  note: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("StockLedger", ledgerSchema);
