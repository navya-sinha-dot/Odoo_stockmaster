import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function DeliveryForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [delivery, setDelivery] = useState({
    from: "",
    to: "",
    contact: "",
    scheduleDate: "",
    customer: "",
    reference: "",
    items: [],
    note: "",
  });

  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  // LOAD DATA
  useEffect(() => {
    loadProducts();
    loadLocations();
    if (id) loadExisting();
  }, [id]);

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const loadLocations = async () => {
    const res = await api.get("/locations");
    setLocations(res.data);
  };

  const loadExisting = async () => {
    const res = await api.get(`/deliveries/${id}`);
    const d = res.data;

    setDelivery({
      ...d,
      scheduleDate: d.scheduleDate
        ? new Date(d.scheduleDate).toISOString().split("T")[0]
        : "",
    });
  };

  // Add item
  const addItem = () => {
    setDelivery({
      ...delivery,
      items: [...delivery.items, { product: "", location: "", quantity: 1 }],
    });
  };

  // Update item
  const updateItem = (i, field, value) => {
    const newItems = [...delivery.items];
    newItems[i][field] = value;
    setDelivery({ ...delivery, items: newItems });
  };

  // Remove item
  const removeItem = (i) => {
    setDelivery({
      ...delivery,
      items: delivery.items.filter((_, idx) => idx !== i),
    });
  };

  // SAVE DRAFT (CREATE or UPDATE)
  const saveDraft = async () => {
    if (delivery.items.length === 0)
      return alert("Please add at least one item");

    setLoading(true);

    try {
      if (id) {
        await api.put(`/deliveries/${id}`, delivery);
      } else {
        await api.post("/deliveries", delivery);
      }

      alert("Delivery saved as Draft");
      navigate("/delivery");
    } catch (err) {
      alert(err.response?.data?.msg || "Error saving");
    }

    setLoading(false);
  };

  // VALIDATE
  const validateDelivery = async () => {
    if (!id) return alert("Save draft first");

    if (!window.confirm("Validate delivery? Stock will be reduced.")) return;

    try {
      await api.post(`/deliveries/${id}/validate`);
      alert("Delivery validated");
      navigate("/delivery");
    } catch (err) {
      alert(err.response?.data?.msg);
    }
  };

  // CANCEL
  const cancelDelivery = async () => {
    if (!id) return alert("Save draft first");

    if (!window.confirm("Cancel this delivery?")) return;

    try {
      await api.post(`/deliveries/${id}/cancel`);
      alert("Delivery canceled");
      navigate("/delivery");
    } catch (err) {
      alert(err.response?.data?.msg);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#473472" }}>
        {id ? "Edit Delivery" : "New Delivery"}
      </h1>

      <div className="bg-white p-6 rounded-xl border shadow max-w-4xl">
        {/* Delivery Details */}
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#473472" }}>
          Delivery Information
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* FROM */}
          <div>
            <label className="font-medium">From (Warehouse)</label>
            <select
              className="w-full border p-2 rounded"
              value={delivery.from}
              onChange={(e) =>
                setDelivery({ ...delivery, from: e.target.value })
              }
            >
              <option value="">Select warehouse</option>
              {locations.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name} ({l.shortCode})
                </option>
              ))}
            </select>
          </div>

          {/* TO */}
          <div>
            <label className="font-medium">To (Customer / Destination)</label>
            <input
              className="w-full border p-2 rounded"
              value={delivery.to}
              onChange={(e) => setDelivery({ ...delivery, to: e.target.value })}
              placeholder="e.g. ABC Corporation"
            />
          </div>

          {/* CONTACT */}
          <div>
            <label className="font-medium">Contact Person</label>
            <input
              className="w-full border p-2 rounded"
              value={delivery.contact}
              onChange={(e) =>
                setDelivery({ ...delivery, contact: e.target.value })
              }
              placeholder="e.g. John Doe"
            />
          </div>

          {/* Schedule Date */}
          <div>
            <label className="font-medium">Schedule Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={delivery.scheduleDate}
              onChange={(e) =>
                setDelivery({ ...delivery, scheduleDate: e.target.value })
              }
            />
          </div>

          {/* Reference */}
          <div>
            <label className="font-medium">Reference</label>
            <input
              className="w-full border p-2 rounded"
              value={delivery.reference}
              onChange={(e) =>
                setDelivery({ ...delivery, reference: e.target.value })
              }
              placeholder="Optional DO number"
            />
          </div>
        </div>

        {/* LINE ITEMS */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold" style={{ color: "#473472" }}>
            Delivery Items
          </h2>

          <button
            onClick={addItem}
            className="px-4 py-2 rounded text-white"
            style={{ background: "#473472" }}
          >
            + Add Item
          </button>
        </div>

        <table className="w-full border mb-6">
          <thead>
            <tr style={{ borderBottom: "2px solid #473472" }}>
              <th className="p-2">Product</th>
              <th className="p-2">Location</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {delivery.items.map((item, i) => (
              <tr key={i} className="border-b">
                {/* Product */}
                <td className="p-2">
                  <select
                    className="border p-2 rounded w-full"
                    value={item.product}
                    onChange={(e) => updateItem(i, "product", e.target.value)}
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </td>

                {/* Location */}
                <td className="p-2">
                  <select
                    className="border p-2 rounded w-full"
                    value={item.location}
                    onChange={(e) => updateItem(i, "location", e.target.value)}
                  >
                    <option value="">Select Location</option>
                    {locations.map((l) => (
                      <option key={l._id} value={l._id}>
                        {l.name} ({l.shortCode})
                      </option>
                    ))}
                  </select>
                </td>

                {/* Quantity */}
                <td className="p-2">
                  <input
                    type="number"
                    min="1"
                    className="border p-2 rounded w-full"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(i, "quantity", Number(e.target.value))
                    }
                  />
                </td>

                {/* Remove */}
                <td className="p-2">
                  <button
                    onClick={() => removeItem(i)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}

            {delivery.items.length === 0 && (
              <tr>
                <td colSpan="4" className="p-3 text-gray-500 text-center">
                  No items added
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Notes */}
        <label className="font-medium">Notes</label>
        <textarea
          className="w-full border p-2 rounded mb-6"
          value={delivery.note}
          onChange={(e) => setDelivery({ ...delivery, note: e.target.value })}
          placeholder="Optional note..."
        />

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button
            disabled={loading}
            onClick={saveDraft}
            className="px-6 py-2 rounded text-white font-semibold"
            style={{ background: "#473472" }}
          >
            {loading ? "Saving..." : "Save Draft"}
          </button>

          {id && (
            <button
              onClick={validateDelivery}
              className="px-6 py-2 rounded text-white bg-green-600 font-semibold"
            >
              Validate
            </button>
          )}

          {id && (
            <button
              onClick={cancelDelivery}
              className="px-6 py-2 rounded text-white bg-red-500 font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
