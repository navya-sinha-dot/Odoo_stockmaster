import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true, required: true },
  category: { type: String },
  uom: { type: String, default: "Units" },

  cost: { type: Number, default: 0 },

  stockByLocation: {
    type: Map,
    of: Number,
    default: {},
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
