import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";
import AuthContext from "../../context/AuthContext";

export default function ReceiptForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [reference, setReference] = useState("");
  const [receiveFrom, setReceiveFrom] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [responsible, setResponsible] = useState(user?.loginId || "");
  const [status, setStatus] = useState("Draft");
  const [note, setNote] = useState("");

  const [items, setItems] = useState([
    { product: "", quantity: 1, location: "" },
  ]);

  // NEW: store dropdown data
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadDropdownData();

    // ONLY load receipt when ID is valid
    if (id && id !== "new") loadReceipt();
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

      setReference(r.reference);
      setReceiveFrom(r.receiveFrom || "");
      setScheduleDate(r.scheduleDate ? r.scheduleDate.slice(0, 10) : "");
      setResponsible(r.responsible || user?.loginId || "");
      setStatus(r.status || "Draft");
      setItems(r.items || []);
      setNote(r.note || "");
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const save = async () => {
    const payload = {
      reference,
      receiveFrom,
      scheduleDate,
      responsible,
      items,
      note,
    };

    try {
      if (!id || id === "new") {
        // CREATE
        await api.post("/receipts", payload);
        navigate("/receipts");
      } else {
        // UPDATE
        await api.put(`/receipts/${id}`, payload);
        navigate("/receipts");
      }
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const markReady = async () => {
    try {
      await api.put(`/receipts/${id}/status`, { status: "Ready" });
      setStatus("Ready");
    } catch (err) {
      alert("Could not set to Ready");
    }
  };

  const validateAndDone = async () => {
    try {
      await api.put(`/receipts/${id}/validate`);
      setStatus("Done");
      await loadReceipt();
    } catch (err) {
      alert("Validation failed");
    }
  };

  const addLine = () =>
    setItems([...items, { product: "", quantity: 1, location: "" }]);

  const updateLine = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  return (
    <div style={{ background: "#f2f8ff", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-8 p-8 rounded-3xl bg-white border shadow-md"
        style={{ width: "92%", borderColor: "#473472" }}
      >
        {/* TOP BUTTON BAR */}
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

            <button
              onClick={() => {
                if (confirm("Cancel receipt?")) navigate("/receipts");
              }}
              className="px-4 py-2 border rounded"
              style={{ borderColor: "#53629E" }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#473472" }}>
          {isNew ? "New Receipt" : `Receipt ${reference}`}
        </h2>

        {/* HEADER DETAILS */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm mb-1">Receive From</label>
            <input
              className="w-full border p-2 rounded"
              value={receiveFrom}
              onChange={(e) => setReceiveFrom(e.target.value)}
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
            <label className="block text-sm mb-1">Responsible</label>
            <input
              className="w-full border p-2 rounded"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
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

        {/* PRODUCT LINES */}
        <h3 className="font-semibold mb-2">Products</h3>

        <div className="border rounded-lg overflow-hidden">
          {items.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 items-center p-4 border-b"
            >
              {/* PRODUCT DROPDOWN */}
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

              {/* QUANTITY */}
              <div className="col-span-3">
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={row.quantity}
                  min="1"
                  onChange={(e) => updateLine(i, "quantity", e.target.value)}
                />
              </div>

              {/* LOCATION DROPDOWN */}
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

        {/* ADD PRODUCT */}
        <button
          onClick={addLine}
          className="mt-4 px-4 py-2 border rounded"
          style={{ borderColor: "#473472", color: "#473472" }}
        >
          + Add Product
        </button>

        {/* SAVE BUTTON */}
        <div className="mt-10">
          <button
            onClick={save}
            className="px-6 py-2 rounded text-white font-semibold"
            style={{ background: "#473472" }}
          >
            Save Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
}
