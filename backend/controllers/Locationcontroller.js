import Location from "../models/Location.js";
import Warehouse from "../models/Warehouse.js";

// CREATE LOCATION
export const createLocation = async (req, res) => {
  try {
    const { name, shortCode, warehouse } = req.body;

    const exists = await Location.findOne({ shortCode });
    if (exists)
      return res.status(400).json({ msg: "Short code already exists" });

    const warehouseExists = await Warehouse.findById(warehouse);
    if (!warehouseExists)
      return res.status(404).json({ msg: "Warehouse not found" });

    const location = await Location.create({ name, shortCode, warehouse });

    res.json({ msg: "Location created", location });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET ALL LOCATIONS
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().populate("warehouse");
    res.json(locations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE LOCATION
export const deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ msg: "Location deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
