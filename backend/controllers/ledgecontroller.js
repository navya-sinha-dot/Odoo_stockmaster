import StockLedger from "../models/StockLedger.js";
import Product from "../models/Product.js";
import Location from "../models/Location.js";
import mongoose from "mongoose";

export const listLedger = async (req, res) => {
  try {
    const {
      type,
      product,
      location,
      ref,
      q,
      dateFrom,
      dateTo,
      sort = "-createdAt",
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (product) filter.product = product;
    if (location) filter.location = location;
    if (ref) {
      if (mongoose.Types.ObjectId.isValid(ref)) filter.refId = ref;
      else filter.note = { $regex: ref, $options: "i" };
    }
    if (q) {
      filter.$or = [{ note: { $regex: q, $options: "i" } }];
    }
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const skip = (Math.max(1, page) - 1) * limit;

    const [total, items] = await Promise.all([
      StockLedger.countDocuments(filter),
      StockLedger.find(filter)
        .populate("product", "name sku")
        .populate("location", "name shortCode")
        .populate("createdBy", "loginId name")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
    ]);

    res.json({ total, page: Number(page), limit: Number(limit), items });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const groupedMoves = async (req, res) => {
  try {
    const {
      dateFrom,
      dateTo,
      type,
      product,
      location,
      q,
      page = 1,
      limit = 50,
    } = req.query;

    const match = {};
    if (type) match.type = type;
    if (product) match.product = mongoose.Types.ObjectId(product);
    if (location) match.location = mongoose.Types.ObjectId(location);
    if (q) match.$or = [{ note: { $regex: q, $options: "i" } }];
    if (dateFrom || dateTo) {
      match.createdAt = {};
      if (dateFrom) match.createdAt.$gte = new Date(dateFrom);
      if (dateTo) match.createdAt.$lte = new Date(dateTo);
    }

    const pipeline = [
      { $match: match },
      {
        $project: {
          product: 1,
          location: 1,
          change: 1,
          type: 1,
          refId: 1,
          note: 1,
          createdAt: 1,
          createdBy: 1,
        },
      },

      {
        $group: {
          _id: {
            $ifNull: ["$refId", { type: "$type", createdAt: "$createdAt" }],
          },
          reference: { $first: "$refId" },
          type: { $first: "$type" },
          date: { $min: "$createdAt" },
          lines: {
            $push: {
              product: "$product",
              location: "$location",
              change: "$change",
              note: "$note",
              createdAt: "$createdAt",
            },
          },
          totalChange: { $sum: "$change" },
        },
      },
      { $sort: { date: -1 } },
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) },
    ];

    const grouped = await StockLedger.aggregate(pipeline);

    const populated = await Promise.all(
      grouped.map(async (g) => {
        const lines = await Promise.all(
          g.lines.map(async (line) => {
            const p = await Product.findById(line.product).select("name sku");
            const l = await Location.findById(line.location).select(
              "name shortCode"
            );
            return { ...line, product: p, location: l };
          })
        );
        return { ...g, lines };
      })
    );

    res.json({ page: Number(page), limit: Number(limit), items: populated });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getLedgerEntry = async (req, res) => {
  try {
    const entry = await StockLedger.findById(req.params.id)
      .populate("product", "name sku")
      .populate("location", "name shortCode")
      .populate("createdBy", "loginId name");

    if (!entry) return res.status(404).json({ msg: "Ledger entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
