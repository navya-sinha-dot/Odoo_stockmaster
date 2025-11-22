import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    uom: "Units",
    cost: 0,
    initialStock: 0,
    location: "",
  });

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    const res = await api.get("/locations");
    setLocations(res.data);
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", form);
      alert("Product created!");
      navigate("/stock");
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating product");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#473472" }}>
        Create Product
      </h1>

      <div className="bg-white p-6 rounded-xl border shadow max-w-xl">
        <form onSubmit={submitProduct} className="space-y-4">
          <div>
            <label className="font-medium">Product Name</label>
            <input
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="font-medium">SKU</label>
            <input
              className="w-full border p-2 rounded"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="font-medium">Category</label>
            <input
              className="w-full border p-2 rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">UOM</label>
            <input
              className="w-full border p-2 rounded"
              value={form.uom}
              onChange={(e) => setForm({ ...form, uom: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">Per Unit Cost</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.cost}
              onChange={(e) =>
                setForm({ ...form, cost: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="font-medium">Initial Stock</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.initialStock}
              onChange={(e) =>
                setForm({
                  ...form,
                  initialStock: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">Initial Stock Location</label>
            <select
              className="w-full border p-2 rounded"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            >
              <option value="">Select location</option>
              {locations.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name} ({l.shortCode})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2 rounded text-white font-semibold"
            style={{ background: "#473472" }}
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}
