import mongoose from "mongoose";

const deliveryItemSchema = new mongoose.Schema({
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

const deliverySchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: false,
  },

  to: { type: String },
  contact: { type: String },
  scheduleDate: { type: Date },

  customer: { type: String },
  reference: { type: String },
  items: [deliveryItemSchema],

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

export default mongoose.model("Delivery", deliverySchema);
