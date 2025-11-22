import Delivery from "../models/Delivery.js";
import Product from "../models/Product.js";
import StockLedger from "../models/StockLedger.js";
import mongoose from "mongoose";

//create delivery
export const createDelivery = async (req, res) => {
  try {
    const { from, to, contact, scheduleDate, customer, reference, items } =
      req.body;

    if (!items || items.length === 0)
      return res
        .status(400)
        .json({ msg: "Delivery must have at least one item" });

    const delivery = await Delivery.create({
      from,
      to,
      contact,
      scheduleDate,
      customer,
      reference,
      items,
      createdBy: req.user?._id || null,
    });

    res.json({ msg: "Delivery created", delivery });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//get all deliveries
export const getDeliveries = async (req, res) => {
  try {
    const data = await Delivery.find()
      .populate("items.product", "name sku")
      .populate("from", "name shortCode")
      .populate("items.location", "name shortCode")
      .populate("createdBy", "loginId")
      .populate("validatedBy", "loginId")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//get one item delivery
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

//validate delivery
export const validateDelivery = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const delivery = await Delivery.findById(req.params.id).session(session);
    if (!delivery) throw new Error("Delivery not found");

    if (delivery.status !== "Draft")
      throw new Error("Only Draft deliveries can be validated");

    // LOOP THROUGH EACH ITEM AND DEDUCT STOCK
    for (const item of delivery.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) throw new Error(`Product ${item.product} not found`);

      const locKey = item.location.toString();
      const current = product.stockByLocation.get(locKey) || 0;

      if (current < item.quantity)
        throw new Error(`Not enough stock for product ${product.name}`);

      product.stockByLocation.set(locKey, current - item.quantity);
      await product.save({ session });

      // LEDGER ENTRY (-)
      await StockLedger.create(
        [
          {
            product: product._id,
            location: item.location,
            change: -item.quantity,
            type: "Delivery",
            refId: delivery._id,
            createdBy: req.user?._id || null,
            note: `Delivery validated (${delivery.reference}) to ${delivery.to}`,
          },
        ],
        { session }
      );
    }

    delivery.status = "Validated";
    delivery.validatedAt = new Date();
    delivery.validatedBy = req.user?._id || null;
    await delivery.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await Delivery.findById(delivery._id)
      .populate("items.product", "name sku")
      .populate("items.location", "name shortCode");

    res.json({
      msg: "Delivery validated and stock updated",
      delivery: populated,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: err.message });
  }
};

//cancel delivery
export const cancelDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ msg: "Delivery not found" });

    if (delivery.status !== "Draft")
      return res
        .status(400)
        .json({ msg: "Only Draft deliveries can be canceled" });

    delivery.status = "Canceled";
    await delivery.save();

    res.json({ msg: "Delivery canceled", delivery });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
