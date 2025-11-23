import Delivery from "../models/Delivery.js";
import Product from "../models/Product.js";
import StockLedger from "../models/StockLedger.js";
import mongoose from "mongoose";

export const createDelivery = async (req, res) => {
  try {
    const { from, to, contact, scheduleDate, customer, items } = req.body;

    if (!items || items.length === 0)
      return res
        .status(400)
        .json({ msg: "Delivery must have at least one item" });

    // Auto-generate reference
    const count = await Delivery.countDocuments();
    const reference = `WH1/OUT/${String(count + 1).padStart(4, "0")}`;

    const delivery = await Delivery.create({
      from,
      to,
      contact,
      scheduleDate,
      customer,
      reference,
      items,
      createdBy: req.user?._id || null,
      status: "Draft",
    });

    res.json({ msg: "Delivery created", delivery });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getDeliveries = async (req, res) => {
  try {
    const data = await Delivery.find()
      .populate("items.product", "name sku")
      .populate("items.location", "name shortCode")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("items.product", "name sku")
      .populate("items.location", "name shortCode");

    if (!delivery) return res.status(404).json({ msg: "Delivery not found" });

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const checkStock = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ msg: "Delivery not found" });

    let allAvailable = true;

    for (const item of delivery.items) {
      const product = await Product.findById(item.product);
      const locKey = item.location.toString();

      const current = product.stockByLocation.get(locKey) || 0;

      if (current < item.quantity) {
        allAvailable = false;
        break;
      }
    }

    delivery.status = allAvailable ? "Ready" : "Waiting";
    await delivery.save();

    res.json({
      msg: `Delivery moved to ${delivery.status}`,
      delivery,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const validateDelivery = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const delivery = await Delivery.findById(req.params.id).session(session);
    if (!delivery) throw new Error("Delivery not found");

    if (delivery.status !== "Ready")
      throw new Error("Only Ready deliveries can be validated");

    for (const item of delivery.items) {
      const product = await Product.findById(item.product).session(session);
      const locKey = item.location.toString();
      const current = product.stockByLocation.get(locKey) || 0;

      if (current < item.quantity)
        throw new Error(`Not enough stock for ${product.name}`);

      product.stockByLocation.set(locKey, current - item.quantity);
      await product.save({ session });

      await StockLedger.create(
        [
          {
            product: product._id,
            location: item.location,
            change: -item.quantity,
            type: "Delivery",
            refId: delivery._id,
            note: `Delivery validated (${delivery.reference})`,
            createdBy: req.user?._id || null,
          },
        ],
        { session }
      );
    }

    delivery.status = "Done";
    delivery.validatedAt = new Date();
    delivery.doneAt = new Date();
    delivery.validatedBy = req.user?._id || null;

    await delivery.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      msg: "Delivery validated & stock updated",
      delivery,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: err.message });
  }
};

export const cancelDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ msg: "Delivery not found" });

    if (delivery.status === "Done")
      return res
        .status(400)
        .json({ msg: "Done deliveries cannot be canceled" });

    delivery.status = "Canceled";
    await delivery.save();

    res.json({ msg: "Delivery canceled", delivery });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
