import Receipt from "../models/Receipt.js";
import Product from "../models/Product.js";
import StockLedger from "../models/StockLedger.js";
import mongoose from "mongoose";

export const createReceipt = async (req, res) => {
  try {
    const { supplier, items, scheduleDate } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ msg: "Receipt must have at least one item" });
    }

    const count = await Receipt.countDocuments();
    const reference = `WH1/IN/${String(count + 1).padStart(4, "0")}`;

    const receipt = await Receipt.create({
      supplier,
      reference,
      scheduleDate,
      items,
      createdBy: req.user?._id || null,
      status: "Draft",
    });

    res.json({ msg: "Receipt created", receipt });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate("items.product", "name sku")
      .populate("items.location", "name shortCode")
      .populate("createdBy", "loginId name")
      .populate("validatedBy", "loginId name")
      .sort({ createdAt: -1 });

    res.json(receipts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate("items.product", "name sku")
      .populate("items.location", "name shortCode");

    if (!receipt) return res.status(404).json({ msg: "Receipt not found" });

    res.json(receipt);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const validateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) return res.status(404).json({ msg: "Receipt not found" });

    if (receipt.status !== "Draft") {
      return res
        .status(400)
        .json({ msg: "Only Draft receipts can be validated" });
    }

    receipt.status = "Ready";
    receipt.validatedBy = req.user?._id || null;
    receipt.validatedAt = new Date();

    await receipt.save();

    res.json({ msg: "Receipt moved to Ready", receipt });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const completeReceipt = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const receipt = await Receipt.findById(req.params.id).session(session);
    if (!receipt) throw new Error("Receipt not found");

    if (receipt.status !== "Ready") {
      throw new Error("Only Ready receipts can be completed");
    }

    for (const item of receipt.items) {
      const prod = await Product.findById(item.product).session(session);
      if (!prod) throw new Error(`Product ${item.product} not found`);

      const locKey = item.location.toString();
      const current = prod.stockByLocation.get(locKey) || 0;

      prod.stockByLocation.set(locKey, current + item.quantity);
      await prod.save({ session });

      await StockLedger.create(
        [
          {
            product: prod._id,
            location: item.location,
            change: item.quantity,
            type: "Receipt",
            refId: receipt._id,
            note: `Receipt completed (${receipt.reference})`,
            createdBy: req.user?._id || null,
          },
        ],
        { session }
      );
    }

    receipt.status = "Done";
    receipt.doneAt = new Date();

    await receipt.save({ session });

    await session.commitTransaction();
    res.json({ msg: "Receipt completed (Done)", receipt });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ msg: err.message });
  } finally {
    session.endSession();
  }
};

export const cancelReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ msg: "Receipt not found" });

    if (receipt.status !== "Draft") {
      return res
        .status(400)
        .json({ msg: "Only Draft receipts can be canceled" });
    }

    receipt.status = "Canceled";
    await receipt.save();

    res.json({ msg: "Receipt canceled", receipt });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
