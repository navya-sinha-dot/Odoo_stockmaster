import Transfer from "../models/Transfer.js";
import Product from "../models/Product.js";
import StockLedger from "../models/StockLedger.js";
import mongoose from "mongoose";

export const createTransfer = async (req, res) => {
  try {
    const { reference, items } = req.body;

    if (!items || items.length === 0)
      return res
        .status(400)
        .json({ msg: "Transfer must have at least one item" });

    const transfer = await Transfer.create({
      reference,
      items,
      createdBy: req.user?._id || null,
    });

    res.json({ msg: "Transfer created", transfer });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate("items.product", "name sku")
      .populate("items.fromLocation", "name shortCode")
      .populate("items.toLocation", "name shortCode")
      .sort({ createdAt: -1 });

    res.json(transfers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const validateTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const transfer = await Transfer.findById(req.params.id).session(session);
    if (!transfer) throw new Error("Transfer not found");

    if (transfer.status !== "Draft")
      throw new Error("Only Draft transfers can be validated");

    for (const item of transfer.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) throw new Error(`Product ${item.product} not found`);

      const from = item.fromLocation.toString();
      const to = item.toLocation.toString();

      const currentFromStock = product.stockByLocation.get(from) || 0;

      if (currentFromStock < item.quantity)
        throw new Error(
          `Insufficient stock in source location for ${product.name}`
        );

      // Deduct from source
      product.stockByLocation.set(from, currentFromStock - item.quantity);

      // Add to destination
      const currentToStock = product.stockByLocation.get(to) || 0;
      product.stockByLocation.set(to, currentToStock + item.quantity);

      await product.save({ session });

      // Ledger entry (negative at source)
      await StockLedger.create(
        [
          {
            product: product._id,
            location: item.fromLocation,
            change: -item.quantity,
            type: "Transfer",
            refId: transfer._id,
            createdBy: req.user?._id || null,
            note: `Internal Transfer - OUT (${transfer.reference})`,
          },
        ],
        { session }
      );

      // Ledger entry (positive at destination)
      await StockLedger.create(
        [
          {
            product: product._id,
            location: item.toLocation,
            change: item.quantity,
            type: "Transfer",
            refId: transfer._id,
            createdBy: req.user?._id || null,
            note: `Internal Transfer - IN (${transfer.reference})`,
          },
        ],
        { session }
      );
    }

    transfer.status = "Validated";
    transfer.validatedAt = new Date();
    transfer.validatedBy = req.user?._id || null;
    await transfer.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await Transfer.findById(transfer._id)
      .populate("items.product", "name sku")
      .populate("items.fromLocation", "name shortCode")
      .populate("items.toLocation", "name shortCode");

    res.json({ msg: "Internal transfer validated", transfer: populated });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: err.message });
  }
};
