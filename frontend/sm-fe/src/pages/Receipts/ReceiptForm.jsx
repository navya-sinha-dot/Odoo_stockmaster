import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";
import AuthContext from "../../context/AuthContext";

export default function ReceiptForm() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [reference, setReference] = useState("");
  const [supplier, setSupplier] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [status, setStatus] = useState("Draft");

  const [items, setItems] = useState([
    { product: "", quantity: 1, location: "" },
  ]);

  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadDropdownData();
    if (!isNew) loadReceipt();
  }, [id]);

  const loadDropdownData = async () => {
    const p = await api.get("/products");
    const l = await api.get("/locations");

    setProducts(p.data || []);
    setLocations(l.data || []);
  };

  const loadReceipt = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/receipts/${id}`);
      const r = res.data;

      setReference(r.reference || "");
      setSupplier(r.supplier || "");
      setScheduleDate(r.scheduleDate ? r.scheduleDate.slice(0, 10) : "");
      setStatus(r.status || "Draft");
      setItems(r.items || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const save = async () => {
    const payload = {
      supplier,
      scheduleDate,
      items,
    };

    try {
      if (isNew) {
        await api.post("/receipts", payload);
      } else {
        await api.put(`/receipts/${id}`, payload);
      }
      navigate("/receipts");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const validate = async () => {
    try {
      await api.post(`/receipts/${id}/validate`);
      await loadReceipt();
    } catch (err) {
      alert("Validation failed");
    }
  };

  const complete = async () => {
    try {
      await api.post(`/receipts/${id}/complete`);
      await loadReceipt();
    } catch (err) {
      alert("Completion failed");
    }
  };

  const addLine = () =>
    setItems([...items, { product: "", quantity: 1, location: "" }]);

  const updateLine = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  return (
    <div style={{ background: "#f2f8ff", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-8 p-8 rounded-3xl bg-white border shadow-md"
        style={{ width: "92%", borderColor: "#473472" }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/receipts")}
            className="px-4 py-2 border rounded"
            style={{ borderColor: "#473472", color: "#473472" }}
          >
            Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border rounded"
              style={{ borderColor: "#473472" }}
            >
              Print
            </button>

            {status === "Draft" && !isNew && (
              <button
                onClick={validate}
                className="px-4 py-2 border rounded"
                style={{ borderColor: "#53629E", color: "#53629E" }}
              >
                Validate → Ready
              </button>
            )}

            {status === "Ready" && (
              <button
                onClick={complete}
                className="px-4 py-2 border rounded bg-green-600 text-white"
              >
                Validate → Done
              </button>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6" style={{ color: "#473472" }}>
          {isNew ? "New Receipt" : `Receipt ${reference}`}
        </h2>

        {/* HEADER DETAILS */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm mb-1">
              Receive From (Supplier)
            </label>
            <input
              className="w-full border p-2 rounded"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Supplier / Vendor"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Schedule Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Status</label>
            <div
              className="p-2 rounded border"
              style={{ borderColor: "#53629E" }}
            >
              {status}
            </div>
          </div>
        </div>

        <h3 className="font-semibold mb-2">Products</h3>

        <div className="border rounded-lg overflow-hidden">
          {items.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 items-center p-4 border-b"
            >
              <div className="col-span-6">
                <select
                  className="w-full border p-2 rounded"
                  value={row.product}
                  onChange={(e) => updateLine(i, "product", e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={row.quantity}
                  min="1"
                  onChange={(e) => updateLine(i, "quantity", e.target.value)}
                />
              </div>

              <div className="col-span-3">
                <select
                  className="w-full border p-2 rounded"
                  value={row.location}
                  onChange={(e) => updateLine(i, "location", e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locations.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.name} ({l.shortCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addLine}
          className="mt-4 px-4 py-2 border rounded"
          style={{ borderColor: "#473472", color: "#473472" }}
        >
          + Add Product
        </button>

        {status === "Draft" && (
          <div className="mt-10">
            <button
              onClick={save}
              className="px-6 py-2 rounded text-white font-semibold"
              style={{ background: "#473472" }}
            >
              Save Receipt
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
