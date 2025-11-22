import Warehouse from "../models/Warehouse.js";

// CREATE WAREHOUSE
export const createWarehouse = async (req, res) => {
  try {
    const { name, shortCode, address } = req.body;

    const exists = await Warehouse.findOne({ shortCode });
    if (exists)
      return res.status(400).json({ msg: "Short Code already exists" });

    const warehouse = await Warehouse.create({ name, shortCode, address });

    res.json({ msg: "Warehouse created", warehouse });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET ALL WAREHOUSES
export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET ONE WAREHOUSE
export const getWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ msg: "Warehouse not found" });

    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE WAREHOUSE
export const updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ msg: "Warehouse updated", warehouse });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE WAREHOUSE
export const deleteWarehouse = async (req, res) => {
  try {
    await Warehouse.findByIdAndDelete(req.params.id);
    res.json({ msg: "Warehouse deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
