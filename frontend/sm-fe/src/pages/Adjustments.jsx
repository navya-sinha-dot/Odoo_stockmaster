import React, { useEffect, useState } from "react";
import api from "../api";
import TopNavDashboard from "../components/TopNavDashboard";

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  const [form, setForm] = useState({
    product: "",
    location: "",
    countedQty: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAdjustments();
    loadProducts();
    loadLocations();
  }, []);

  const loadAdjustments = async () => {
    const res = await api.get("/adjustments");
    setAdjustments(res.data);
  };

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const loadLocations = async () => {
    const res = await api.get("/locations");
    setLocations(res.data);
  };

  const createAdjustment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/adjustments", form);
      setForm({ product: "", location: "", countedQty: "", note: "" });
      loadAdjustments();
      alert("Adjustment created as Draft");
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating adjustment");
    }

    setLoading(false);
  };

  const validateAdjustment = async (id) => {
    if (!window.confirm("Validate this adjustment?")) return;

    try {
      await api.post(`/adjustments/${id}/validate`);
      loadAdjustments();
    } catch (err) {
      alert(err.response?.data?.msg || "Error validating");
    }
  };

  const cancelAdjustment = async (id) => {
    if (!window.confirm("Cancel this adjustment?")) return;

    try {
      await api.post(`/adjustments/${id}/cancel`);
      loadAdjustments();
    } catch (err) {
      alert(err.response?.data?.msg || "Error canceling");
    }
  };

  return (
    <>
      <TopNavDashboard />

      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#473472" }}>
          Stock Adjustments
        </h1>

        <form
          onSubmit={createAdjustment}
          className="bg-white p-6 rounded-xl shadow max-w-xl mb-10 border border-gray-200"
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "#473472" }}
          >
            Create Adjustment
          </h2>

          <label className="text-sm font-semibold">Product</label>
          <select
            className="w-full p-2 border rounded mb-3"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>

          <label className="text-sm font-semibold">Location</label>
          <select
            className="w-full p-2 border rounded mb-3"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          >
            <option value="">Select Location</option>
            {locations.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name} ({l.shortCode})
              </option>
            ))}
          </select>

          <label className="text-sm font-semibold">Counted Quantity</label>
          <input
            type="number"
            className="w-full p-2 border rounded mb-3"
            value={form.countedQty}
            onChange={(e) => setForm({ ...form, countedQty: e.target.value })}
            required
          />

          <label className="text-sm font-semibold">Note (optional)</label>
          <textarea
            className="w-full p-2 border rounded mb-3"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />

          <button
            type="submit"
            className="w-full py-2 text-white rounded font-bold"
            style={{ background: "#473472" }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Adjustment"}
          </button>
        </form>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "#473472" }}
          >
            All Adjustments
          </h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: "2px solid #473472" }}>
                <th className="p-2">Product</th>
                <th className="p-2">Location</th>
                <th className="p-2">System Qty</th>
                <th className="p-2">Counted Qty</th>
                <th className="p-2">Difference</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {adjustments.map((a) => (
                <tr key={a._id} className="border-b">
                  <td className="p-2">{a.product?.name}</td>
                  <td className="p-2">{a.location?.name}</td>
                  <td className="p-2">{a.systemQty}</td>
                  <td className="p-2">{a.countedQty}</td>
                  <td className="p-2">{a.difference}</td>
                  <td className="p-2 font-semibold">{a.status}</td>

                  <td className="p-2 flex gap-2">
                    {a.status === "Draft" && (
                      <>
                        <button
                          onClick={() => validateAdjustment(a._id)}
                          className="px-3 py-1 rounded text-white"
                          style={{ background: "#473472" }}
                        >
                          Validate
                        </button>
                        <button
                          onClick={() => cancelAdjustment(a._id)}
                          className="px-3 py-1 rounded bg-red-500 text-white"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {adjustments.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No adjustments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
