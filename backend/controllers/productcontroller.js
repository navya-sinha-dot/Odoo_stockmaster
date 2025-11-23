import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, uom, cost, initialStock, location } = req.body;

    const exists = await Product.findOne({ sku });
    if (exists) return res.status(400).json({ msg: "SKU already exists" });

    const product = new Product({
      name,
      sku,
      category,
      uom,
      cost, // NEW
      stockByLocation: {},
    });

    if (initialStock && location) {
      product.stockByLocation.set(location, initialStock);
    }

    await product.save();
    res.json({ msg: "Product created", product });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json({ msg: "Product updated", product });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
