import Adjustment from "../models/Adjustment.js";
import Product from "../models/Product.js";
import StockLedger from "../models/StockLedger.js";
import mongoose from "mongoose";

export const createAdjustment = async (req, res) => {
  try {
    const { product, location, countedQty, note } = req.body;

    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ msg: "Product not found" });

    const systemQty = prod.stockByLocation.get(location) || 0;
    const difference = countedQty - systemQty;

    const adjustment = await Adjustment.create({
      product,
      location,
      systemQty,
      countedQty,
      difference,
      note,
      createdBy: req.user?._id || null,
    });

    res.json({ msg: "Adjustment created", adjustment });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getAdjustments = async (req, res) => {
  try {
    const data = await Adjustment.find()
      .populate("product", "name sku")
      .populate("location", "name shortCode")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const validateAdjustment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const adj = await Adjustment.findById(req.params.id).session(session);
    if (!adj) throw new Error("Adjustment not found");
    if (adj.status !== "Draft")
      throw new Error("Only Draft adjustments can be validated");

    const product = await Product.findById(adj.product).session(session);

    const locKey = adj.location.toString();
    const current = product.stockByLocation.get(locKey) || 0;

    const newQty = adj.countedQty;
    product.stockByLocation.set(locKey, newQty);

    await product.save({ session });

    await StockLedger.create(
      [
        {
          product: product._id,
          location: adj.location,
          change: adj.difference,
          type: "Adjustment",
          refId: adj._id,
          note: adj.note || "Stock adjustment",
          createdBy: req.user?._id || null,
        },
      ],
      { session }
    );

    adj.status = "Validated";
    adj.validatedAt = new Date();
    adj.validatedBy = req.user?._id || null;

    await adj.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await Adjustment.findById(adj._id)
      .populate("product", "name sku")
      .populate("location", "name shortCode");

    res.json({ msg: "Adjustment validated", adjustment: populated });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: err.message });
  }
};

export const cancelAdjustment = async (req, res) => {
  try {
    const adj = await Adjustment.findById(req.params.id);

    if (!adj) return res.status(404).json({ msg: "Adjustment not found" });
    if (adj.status !== "Draft")
      return res
        .status(400)
        .json({ msg: "Only Draft adjustments can be canceled" });

    adj.status = "Canceled";
    await adj.save();
    res.json({ msg: "Adjustment canceled", adjustment: adj });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
