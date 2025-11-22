import React, { useState, useEffect } from "react";
import api from "../../api";
import { motion } from "framer-motion";

export default function NewReceipt() {
  const [supplier, setSupplier] = useState("");
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([
    { product: "", quantity: "", location: "" },
  ]);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const prod = await api.get("/products");
      const loc = await api.get("/locations");
      setProducts(prod.data);
      setLocations(loc.data);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  const addLine = () => {
    setItems([...items, { product: "", quantity: "", location: "" }]);
  };

  const updateLine = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const createReceipt = async () => {
    if (!supplier) {
      alert("Supplier name required");
      return;
    }
    if (items.some((i) => !i.product || !i.quantity || !i.location)) {
      alert("Please complete all product lines");
      return;
    }

    try {
      await api.post("/receipts", {
        supplier,
        reference: `GRN-${Date.now()}`,
        items,
      });

      setSupplier("");
      setItems([{ product: "", quantity: "", location: "" }]);
      setMsg("Receipt created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create receipt");
    }
  };

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#473472" }}>
        New Receipt
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow border border-gray-200"
      >
        <div className="space-y-4">
          {/* Supplier Field */}
          <div>
            <label className="text-sm font-medium" style={{ color: "#53629E" }}>
              Supplier Name
            </label>
            <input
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Enter supplier name"
              className="w-full p-2 border rounded-md outline-none focus:ring-2 mt-1"
              style={{
                borderColor: "#53629E",
                "--tw-ring-color": "#87BAC3",
              }}
            />
          </div>

          <div className="border-t pt-4">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "#53629E" }}
            >
              Product Lines
            </h2>

            {items.map((line, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
              >
                {/* Product */}
                <select
                  value={line.product}
                  onChange={(e) => updateLine(index, "product", e.target.value)}
                  className="p-2 border rounded-md outline-none focus:ring-2"
                  style={{
                    borderColor: "#53629E",
                    "--tw-ring-color": "#87BAC3",
                  }}
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>

                {/* Quantity */}
                <input
                  type="number"
                  value={line.quantity}
                  onChange={(e) =>
                    updateLine(index, "quantity", e.target.value)
                  }
                  placeholder="Quantity"
                  className="p-2 border rounded-md outline-none focus:ring-2"
                  style={{
                    borderColor: "#53629E",
                    "--tw-ring-color": "#87BAC3",
                  }}
                />

                {/* Location */}
                <select
                  value={line.location}
                  onChange={(e) =>
                    updateLine(index, "location", e.target.value)
                  }
                  className="p-2 border rounded-md outline-none focus:ring-2"
                  style={{
                    borderColor: "#53629E",
                    "--tw-ring-color": "#87BAC3",
                  }}
                >
                  <option value="">Select Location</option>
                  {locations.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.name} ({l.warehouse?.shortCode})
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              onClick={addLine}
              className="px-4 py-2 rounded-md font-semibold"
              style={{ background: "#53629E", color: "white" }}
            >
              + Add Line
            </button>
          </div>

          <button
            onClick={createReceipt}
            className="px-4 py-2 rounded-md text-white font-semibold mt-4"
            style={{ background: "#473472" }}
          >
            Create Receipt
          </button>

          {msg && <p className="text-green-700 mt-3">{msg}</p>}
        </div>
      </motion.div>
    </div>
  );
}
