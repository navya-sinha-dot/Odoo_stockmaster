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
  // NEW FIELDS ⬇⬇⬇
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: false,
  },

  to: { type: String }, // customer name / destination
  contact: { type: String }, // phone or person
  scheduleDate: { type: Date }, // planned delivery date
  // NEW FIELDS END ⬆⬆⬆

  customer: { type: String }, // legacy, optional
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
